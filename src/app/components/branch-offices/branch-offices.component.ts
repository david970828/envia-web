import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { GuidesService } from "../../services/guides-service";
import { ColombiaService } from "../../services/colombia-service";
import { FormControl, FormGroup, FormGroupDirective, Validators } from "@angular/forms";

@Component({
  selector: 'app-branch-offices',
  templateUrl: './branch-offices.component.html',
  styleUrls: ['./branch-offices.component.css']
})
export class BranchOfficesComponent implements OnInit {

  cityListSender: any;
  formGuide: FormGroup;
  departmentsList: any;
  cityListAddressee: any;
  displayedColumns: string[];
  @ViewChild(MatPaginator)
  paginator: MatPaginator | undefined;
  @ViewChild(FormGroupDirective)
  formDirective: FormGroupDirective | undefined;
  listGuides: MatTableDataSource<any>;

  constructor(private colombiaService: ColombiaService, private guidesService: GuidesService,
              private toastService: ToastrService, private translateService: TranslateService) {
    this.formGuide = new FormGroup({
      dateSentSender: new FormControl('', Validators.required),
      nameSender: new FormControl('David', Validators.required),
      lastNameSender: new FormControl('Pardo', Validators.required),
      departmentSender: new FormControl('', Validators.required),
      citySender: new FormControl('', Validators.required),
      phoneSender: new FormControl('3045214919', Validators.required),
      documentSender: new FormControl('1032492883', Validators.required),
      postalCodeSender: new FormControl('12120', Validators.required),
      nameAddressee: new FormControl('Ricardo', Validators.required),
      lastNameAddressee: new FormControl('Gonzalez', Validators.required),
      addressAddressee: new FormControl('Carrera 16K 36 24 S', Validators.required),
      phoneAddressee: new FormControl('3123156256', Validators.required),
      documentAddressee: new FormControl('51971515', Validators.required),
      postalCodeAddressee: new FormControl('12121', Validators.required),
      departmentAddressee: new FormControl('', Validators.required),
      cityAddressee: new FormControl('', Validators.required),
      contentGuide: new FormControl('Cables', Validators.required),
      weightGuide: new FormControl('4', Validators.required),
      unitGuide: new FormControl('10', Validators.required),
      volumeGuide: new FormControl('1', Validators.required),
      declaredValueGuide: new FormControl(0, Validators.required),
      serviceValueGuide: new FormControl(0, Validators.required),
      othersValueGuide: new FormControl(0, Validators.required),
      notesGuide: new FormControl(''),
    });

    this.cityListSender = [];
    this.departmentsList = [];
    this.cityListAddressee = [];
    this.listGuides = new MatTableDataSource<any>();
    this.displayedColumns = ['id', 'date_admission', 'origin_city', 'destination_city', 'content_guide', 'status'];
  }

  ngOnInit(): void {
    this.getDataColombia();
    this.getGuides();
    this.formGuide.controls.departmentSender.valueChanges.subscribe(change => {
      this.cityListSender = this.listCities(change);
    });
    this.formGuide.controls.departmentAddressee.valueChanges.subscribe(change => {
      this.cityListAddressee = this.listCities(change);
    });
  }

  listCities(department: string): string[] {
    return this.departmentsList.find((item: any) => { return item.departamento === department }).ciudades;
  }

  getDataColombia(): void {
    this.colombiaService.readConfigurationColombia().subscribe(response => {
      this.departmentsList = response;
    }, error => {
      this.toastService.error(this.translateService.instant('ERRORS.LOAD_DATA'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  newGuide(): void {
    let data = {
      guide: {
        status_guide: 0,
        date_admission: this.formGuide.controls.dateSentSender.value,
        notes_guide: this.formGuide.controls.notesGuide.value,
        content_guide: this.formGuide.controls.contentGuide.value,
        units_in_guide: this.formGuide.controls.unitGuide.value,
        weight_in_guide: this.formGuide.controls.weightGuide.value,
        volume_in_guide: this.formGuide.controls.volumeGuide.value,
        declared_value_guide: this.formGuide.controls.declaredValueGuide.value,
        service_value_guide: this.formGuide.controls.serviceValueGuide.value,
        other_cost_guide: this.formGuide.controls.othersValueGuide.value,
        weight_payment_guide: 0,
        freight_guide: 0
      },
      guide_person: {
        origin_city: this.formGuide.controls.citySender.value,
        destination_city: this.formGuide.controls.cityAddressee.value,
        destination_regional: this.formGuide.controls.departmentAddressee.value,
        address_addressee: this.formGuide.controls.addressAddressee.value,
        document_sender: this.formGuide.controls.documentSender.value,
        document_addressee: this.formGuide.controls.documentAddressee.value
      },
      sender: {
        first_name_person: this.formGuide.controls.nameSender.value,
        last_name_person: this.formGuide.controls.lastNameSender.value,
        phone_person: this.formGuide.controls.phoneSender.value,
        document_person: this.formGuide.controls.documentSender.value,
        postal_code_person: this.formGuide.controls.postalCodeSender.value
      },
      addressee: {
        first_name_person: this.formGuide.controls.nameAddressee.value,
        last_name_person: this.formGuide.controls.lastNameAddressee.value,
        phone_person: this.formGuide.controls.phoneSender.value,
        document_person: this.formGuide.controls.documentAddressee.value,
        postal_code_person: this.formGuide.controls.postalCodeAddressee.value
      }
    }
    this.guidesService.createGuide(data).subscribe(response => {
      this.downloadFile(response);
      this.getGuides();
      // @ts-ignore
      this.formDirective.resetForm();
      this.formGuide.reset();
    }, error => {
        this.toastService.error(this.translateService.instant('ERRORS.GUIDE_GENERATE'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  downloadFile(response: any) {
    const elm = document.createElement('a');
    elm.href = response
    elm.download = 'guide.pdf';
    elm.click();
    elm.remove();
    this.toastService.success(this.translateService.instant('LABELS.SUCCESS_GUIDE'), this.translateService.instant('LABELS.SUCCESS_GUIDE_TITLE'));
  }

  getGuides() {
    this.guidesService.listGuides().subscribe(response => {
      this.listGuides =  new MatTableDataSource(response);
      //@ts-ignore
      this.listGuides.paginator = this.paginator;
    }, error => {
      this.toastService.error(this.translateService.instant('ERRORS.LOAD_DATA'), this.translateService.instant('ERRORS.TITLE'));
    });
  }
}
