import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course, ImageInfo } from '../../../shared/models';
import { CoursesService } from '../../../shared/services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';
import { tap, switchMap, map } from 'rxjs/operators';
import { ImageManipulationService } from '../../services/image-manipulation.service';
import { UsersService } from '../../../shared/services/users.service';

@Component({
  selector: 'app-admin-courses-edit',
  templateUrl: './admin-courses-edit.component.html',
  styleUrls: ['./admin-courses-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminCoursesEditComponent {
  id: string;
  course$: Observable<Course | {}>;
  isLoading = false;
  isError = false;
  isImageLoading = false;
  deletedImage: string;
  image: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať tento kurz?';
  imgFolder = 'courses/';

  constructor(
    private coursesService: CoursesService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService,
    private imgManipulationService: ImageManipulationService,
    private cd: ChangeDetectorRef
  ) {
    this.id = route.snapshot.params['id'];
    this.course$ = this.id
      ? coursesService.getCourse(this.id).pipe(
          switchMap((item: Course) =>
            this.usersService.getUsersByIds(item.attendees).pipe(map(resolvedAttendees => ({ ...item, resolvedAttendees })))
          ),
          tap((item: Course) => (this.image.fromServer = item && item.picture ? item.picture : undefined))
        )
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA KURZU' : 'NOVÝ KURZ';
  }

  async onSubmit(course: Course) {
    this.onAsync();
    let promises = [];
    if (this.image.currentUpload) {
      const { image, thumbnail } = await this.imgManipulationService.compressAndCreateThumbnail(this.image.currentUpload.file, {
        size: { width: 500, height: 500 }
      });
      const thumbnailUploadPromise = this.fileService.upload(thumbnail, this.imgFolder);
      const originalImageUploadPromise = this.fileService.upload(image, this.imgFolder);

      const uploadedImages = await Promise.all([originalImageUploadPromise, thumbnailUploadPromise]);
      course = {
        ...course,
        picture: (await await uploadedImages[0].ref.getDownloadURL()) + ',' + (await uploadedImages[1].ref.getDownloadURL())
      };
    }
    if (!this.id) {
      promises = [this.coursesService.addCourse(course)];
    } else {
      if (this.deletedImage && !this.image.currentUpload) {
        course = {
          ...course,
          picture: null
        };
      }
      const deleteImagePromises = this.deletedImage ? this.deletedImage.split(',').map(this.fileService.deleteByUrl) : [Promise.resolve()];
      const updateCoursePromise = this.coursesService.updateCourse(this.id, course);
      promises = [...deleteImagePromises, updateCoursePromise];
    }

    Promise.all(promises)
      .then(() => this.router.navigate(['admin', 'courses', 'list']))
      .catch(() => this.onError());
  }

  onImageDelete() {
    if (this.image.fromServer) {
      this.deletedImage = this.image.fromServer;
    }
    this.image = {};
  }

  async onImageUploaded(image: File) {
    const reader = new FileReader();
    this.isImageLoading = true;
    [image] = await this.imgManipulationService.fixImageRotation([image]);
    reader.readAsDataURL(image);
    reader.onloadend = () => {
      this.image.currentUpload = {
        file: image,
        base64: reader.result
      };
      this.isImageLoading = false;
      this.cd.markForCheck();
    };
  }

  onCourseDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromises = this.image.fromServer
          ? this.image.fromServer.split(',').map(this.fileService.deleteByUrl)
          : [Promise.resolve()];

        const deleteCoursePromise = this.coursesService.deleteCourse(this.id);
        Promise.all([...deleteImagePromises, deleteCoursePromise])
          .then(() => this.router.navigate(['admin', 'courses', 'list']))
          .catch(() => this.onError());
      });
  }

  onError() {
    this.isError = true;
    this.isLoading = false;
  }

  onAsync() {
    this.isError = false;
    this.isLoading = true;
  }
}
