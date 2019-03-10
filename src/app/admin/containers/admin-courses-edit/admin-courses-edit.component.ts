import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Course, ImageInfo } from '../../../shared/models';
import { CoursesService } from '../../../shared/services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileService } from '../../../shared/services/files.service';
import { DialogService } from '../../../material/services/dialog.service';
import { tap } from 'rxjs/operators';

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
  deletedImage: string;
  image: ImageInfo = {};
  deleteMessage = 'Naozaj chcete vymazať tento kurz?';
  imgFolder = 'courses/';

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private router: Router,
    private fileService: FileService,
    private dialogService: DialogService
  ) {
    this.id = route.snapshot.params['id'];
    this.course$ = this.id
      ? coursesService
          .getCourse(this.id)
          .pipe(tap((item: Course) => (this.image.fromServer = item && item.picture ? item.picture : undefined)))
      : of({});
  }

  get heading() {
    return !!this.id ? 'ÚPRAVA KURZU' : 'NOVÝ KURZ';
  }

  async onSubmit(course: Course) {
    this.onAsync();
    let promises = [];
    if (this.image.currentUpload) {
      const uploadedImage = await this.fileService.upload(this.image.currentUpload.file, this.imgFolder);
      course = {
        ...course,
        picture: await uploadedImage.ref.getDownloadURL()
      };
    }
    if (!this.id) {
      promises = [this.coursesService.addCourse(course)];
    } else {
      if (this.deletedImage) {
        course = {
          ...course,
          picture: null
        };
      }
      const deleteImagePromise = this.deletedImage ? this.fileService.deleteByUrl(this.deletedImage) : Promise.resolve();
      const updateCoursePromise = this.coursesService.updateCourse(this.id, course);
      promises = [deleteImagePromise, updateCoursePromise];
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

  onImageUploaded(image: File) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.image.currentUpload = {
        file: image,
        base64: reader.result
      };
    };
    reader.readAsDataURL(image);
  }

  onCourseDelete() {
    this.dialogService
      .openConfirmDialog(this.deleteMessage)
      .afterClosed()
      .subscribe((res: boolean) => {
        if (!res) return;
        this.onAsync();
        const deleteImagePromise = this.image.fromServer ? this.fileService.deleteByUrl(this.image.fromServer) : Promise.resolve();
        const deleteCoursePromise = this.coursesService.deleteCourse(this.id);
        Promise.all([deleteImagePromise, deleteCoursePromise])
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
