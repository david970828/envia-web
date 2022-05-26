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
  isEditGuide: boolean;
  departmentsList: any;
  formGuide: FormGroup;
  formSearch: FormGroup;
  cityListAddressee: any;
  isCreatingGuide: boolean;
  displayedColumns: string[];
  listGuides: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild('formDirective') formDirective: FormGroupDirective | undefined;
  @ViewChild('formDirectiveSearch') formDirectiveSearch: FormGroupDirective | undefined;

  constructor(private colombiaService: ColombiaService, private guidesService: GuidesService,
              private toastService: ToastrService, private translateService: TranslateService) {
    this.formGuide = new FormGroup({
      dateSentSender: new FormControl('', Validators.required),
      nameSender: new FormControl('', Validators.required),
      lastNameSender: new FormControl('', Validators.required),
      departmentSender: new FormControl('', Validators.required),
      citySender: new FormControl('', Validators.required),
      phoneSender: new FormControl('', Validators.required),
      documentSender: new FormControl('', Validators.required),
      postalCodeSender: new FormControl('', Validators.required),
      nameAddressee: new FormControl('', Validators.required),
      lastNameAddressee: new FormControl('', Validators.required),
      addressAddressee: new FormControl('', Validators.required),
      phoneAddressee: new FormControl('', Validators.required),
      documentAddressee: new FormControl('', Validators.required),
      postalCodeAddressee: new FormControl('', Validators.required),
      departmentAddressee: new FormControl('', Validators.required),
      cityAddressee: new FormControl('', Validators.required),
      contentGuide: new FormControl('', Validators.required),
      weightGuide: new FormControl('', Validators.required),
      unitGuide: new FormControl('', Validators.required),
      volumeGuide: new FormControl('', Validators.required),
      declaredValueGuide: new FormControl(0, Validators.required),
      serviceValueGuide: new FormControl(0, Validators.required),
      othersValueGuide: new FormControl(0, Validators.required),
      notesGuide: new FormControl(''),
    });

    this.formSearch = new FormGroup({
        id: new FormControl('', [Validators.required])
      },
    );

    this.isEditGuide = false;
    this.cityListSender = [];
    this.departmentsList = [];
    this.cityListAddressee = [];
    this.isCreatingGuide = false;
    this.listGuides = new MatTableDataSource<any>();
    this.displayedColumns = ['id', 'date_admission', 'document_sender', 'document_addressee', 'origin_city', 'destination_city', 'content_guide', 'service_value_guide', 'status'];
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
    this.isCreatingGuide = true;
    this.guidesService.createGuide(this.getDataGuide()).subscribe(response => {
      this.downloadFile(response);
      this.getGuides();
      // @ts-ignore
      this.formDirective.resetForm();
      this.formGuide.reset();
      this.isCreatingGuide = false;
    }, error => {
        this.toastService.error(this.translateService.instant('ERRORS.GUIDE_GENERATE'), this.translateService.instant('ERRORS.TITLE'));
      this.isCreatingGuide = false;
    });
  }

  getDataGuide(): any {
    return {
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
        origin_regional:  this.formGuide.controls.departmentSender.value,
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
    };
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
      // @ts-ignore
      response = response.sort((a, b) => {
        // @ts-ignore
        return new Date(b.date_admission) - new Date(a.date_admission);
      });
      this.listGuides =  new MatTableDataSource(response);
      //@ts-ignore
      this.listGuides.paginator = this.paginator;
    }, error => {
      this.toastService.error(this.translateService.instant('ERRORS.LOAD_DATA'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  getPerson(type: string, event: any) {
    const { target } = event;
    this.guidesService.getPerson(target.value).subscribe(response => {
      if (response !== null){
        if (type === 'origin') {
          this.formGuide.controls.nameSender.setValue(response.first_name_person);
          this.formGuide.controls.lastNameSender.setValue(response.last_name_person);
          this.formGuide.controls.phoneSender.setValue(response.phone_person);
          this.formGuide.controls.postalCodeSender.setValue(response.postal_code_person);
        } else {
          this.formGuide.controls.nameAddressee.setValue(response.first_name_person);
          this.formGuide.controls.lastNameAddressee.setValue(response.last_name_person);
          this.formGuide.controls.phoneAddressee.setValue(response.phone_person);
          this.formGuide.controls.addressAddressee.setValue(response.address_person === null ? '' : response.address_person);
          this.formGuide.controls.postalCodeAddressee.setValue(response.postal_code_person);
        }
      }
    }, error => {
      console.log(error);
    });
  }

  downloadHistoryGuides(): any {
    const csvString = [
      [ 'ID',
        this.translateService.instant('LABELS.REQUEST_DATE'),
        this.translateService.instant('LABELS.ORIGIN_CITY') ,
        this.translateService.instant('LABELS.TARGET_CITY'),
        this.translateService.instant('LABELS.CONTENT'),
        this.translateService.instant('LABELS.STATUS')
      ],
      ...this.listGuides.data.map((item: any) => [
        item.id_guide,
        item.date_admission,
        item.origin_city,
        item.destination_city,
        item.content_guide,
        this.translateService.instant('LABELS.STATUS_GUIDE.' + item.status_guide)
      ])
    ].map(e => e.join(",")).join("\n");
    let blob = new Blob([csvString], {type: 'text/csv;charset=utf-8;'});

    const e = document.createElement('a');
    e.href = URL.createObjectURL(blob);
    e.download = "HistoryGuides.csv";
    document.body.appendChild(e);
    e.click();
    document.body.removeChild(e);
  }

  searchGuide() {
    this.guidesService.getGuide(this.formSearch.controls.id.value).subscribe((response) => {
      if (response === null) {
        this.toastService.error(this.translateService.instant('ERRORS.TRACK_GUIDE'), this.translateService.instant('ERRORS.TITLE'));
        return;
      }
      this.mapperResponseToForm(response);
      this.isEditGuide = true;
    }, (error) => {
      this.toastService.error(this.translateService.instant('ERRORS.TRACK_GUIDE'), this.translateService.instant('ERRORS.TITLE'));
    });
  }

  updateGuide() {
    this.isCreatingGuide = true;
    this.guidesService.updateGuide(this.formSearch.controls.id.value, this.getDataGuide()).subscribe((response) => {
      this.downloadFile(response);
      this.getGuides();
      // @ts-ignore
      this.formDirective.resetForm();
      this.formGuide.reset();
      this.isEditGuide = false;
      this.isCreatingGuide = false;
    }, (error) => {
      this.toastService.error(this.translateService.instant('ERRORS.GUIDE_GENERATE'), this.translateService.instant('ERRORS.TITLE'));
      this.isCreatingGuide = false;
    });
  }

  cancelEdit(): void {
    this.isEditGuide = false;
    // @ts-ignore
    this.formDirective.resetForm();
    this.formGuide.reset();
    // @ts-ignore
    this.formDirectiveSearch.resetForm();
    this.formSearch.reset();
  }

  mapperResponseToForm(response: any): void {
      this.formGuide.controls.dateSentSender.setValue(response.date_admission);
      this.formGuide.controls.nameSender.setValue(response.first_name_sender);
      this.formGuide.controls.lastNameSender.setValue(response.last_name_sender);
      this.formGuide.controls.departmentSender.setValue(response.origin_regional);
      this.formGuide.controls.citySender.setValue(response.origin_city);
      this.formGuide.controls.phoneSender.setValue(response.phone_sender);
      this.formGuide.controls.documentSender.setValue(response.document_sender);
      this.formGuide.controls.postalCodeSender.setValue(response.postal_code_sender);

      this.formGuide.controls.documentAddressee.setValue(response.document_addressee);
      this.formGuide.controls.nameAddressee.setValue(response.first_name_addressee);
      this.formGuide.controls.lastNameAddressee.setValue(response.last_name_addressee);
      this.formGuide.controls.addressAddressee.setValue(response.address_addressee_in_guide);
      this.formGuide.controls.phoneAddressee.setValue(response.phone_addressee);
      this.formGuide.controls.postalCodeAddressee.setValue(response.postal_code_addressee);
      this.formGuide.controls.departmentAddressee.setValue(response.destination_regional);
      this.formGuide.controls.cityAddressee.setValue(response.destination_city);

      this.formGuide.controls.contentGuide.setValue(response.content_guide);
      this.formGuide.controls.weightGuide.setValue(response.weight_in_guide);
      this.formGuide.controls.unitGuide.setValue(response.units_in_guide);
      this.formGuide.controls.volumeGuide.setValue(response.volume_in_guide);
      this.formGuide.controls.declaredValueGuide.setValue(response.declared_value_guide);
      this.formGuide.controls.serviceValueGuide.setValue(response.service_value_guide);
      this.formGuide.controls.othersValueGuide.setValue(response.other_cost_guide);
      this.formGuide.controls.notesGuide.setValue(response.notes_guide);
  }
}
