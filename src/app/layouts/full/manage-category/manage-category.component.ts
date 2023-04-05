import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ManageCategoryService } from 'src/app/services/manage-category.service';
import { GlobalConstraints } from 'src/shared/global-constraints';

declare var window: any;

@Component({
  selector: 'app-manage-category',
  templateUrl: './manage-category.component.html',
  styleUrls: [
    './manage-category.component.css',
    '../../../../shared/button.css',
  ],
})
export class ManageCategoryComponent implements OnInit {
  formAddC: any;
  formEditC: any;
  formDelete: any;
  data: any;
  addCategoryForm: any = FormGroup;
  editCategoryForm: any = FormGroup;
  deleteCategoryForm: any = FormGroup;
  responseMessage: any;

  constructor(
    private manageCategory: ManageCategoryService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  public ngOnInit(): void {
    /*Load Category Details*/
    this.getCategoryDetails();

    /*Identifying Form */
    this.formAddC = new window.bootstrap.Modal(
      document.getElementById('catForm')
    );
    this.formEditC = new window.bootstrap.Modal(
      document.getElementById('editForm')
    );
    this.formDelete = new window.bootstrap.Modal(
      document.getElementById('deleteFormCat')
    );

    /*Form Validation */
    this.addCategoryForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstraints.nameRegex)],
      ],
    });
    this.editCategoryForm = this.formBuilder.group({
      name: [
        null,
        [Validators.required, Validators.pattern(GlobalConstraints.nameRegex)],
      ],
      num: [
        null,
        [Validators.required, Validators.pattern(GlobalConstraints.nameRegex)],
      ],
    });
    this.deleteCategoryForm = this.formBuilder.group({
      id: [null, [Validators.required]],
    });
  }

  /*Open and close Form */
  openAddCategory() {
    this.formAddC.show();
  }
  closeAddCategory() {
    this.formAddC.hide();
  }
  openEditCategory() {
    this.formEditC.show();
  }
  closeEditCategory() {
    this.formEditC.hide();
  }
  openDelete() {
    this.formDelete.show();
  }
  closeDelete() {
    this.formDelete.hide();
  }

  /*Show Category Details in table */
  getCategoryDetails() {
    this.manageCategory.categoryDetails().subscribe((response: any) => {
      this.data = response;
    });
  }

  /*Add New Category */
  add() {
    var categoryForm = this.addCategoryForm.value;
    var data = {
      name: categoryForm.name,
    };
    this.manageCategory.addCategory(data).subscribe(
      (response: any) => {
        this.formAddC.hide();
        this.getCategoryDetails();
        localStorage.setItem('token', response.token);
        this.responseMessage = response?.message;
        this.toastr.success('Successfully added');
      },
      (error) => {
        this.toastr.error(error);
      }
    );
  }

  /*Update existing category */
  updateCategoryDetails() {
    var updateForm = this.editCategoryForm.value;
    var data = {
      name: updateForm.name,
      id: updateForm.num,
    };
    this.manageCategory.updateCategory(data).subscribe((response: any) => {
      this.formEditC.hide();
      this.getCategoryDetails();
      this.toastr.success('Successfully updated');
    });
  }

  deleteCategories() {
    var deleteForm = this.deleteCategoryForm.value;
    var data = {
      id: deleteForm.id,
    };
    this.manageCategory.deleteCategory(data).subscribe(
      (response: any) => {
        this.formDelete.hide();
        this.getCategoryDetails();
        this.toastr.success('Succesfully Deleted Category');
      },
      (error) => {
        this.toastr.error('Something went wrong');
      }
    );
  }
}
