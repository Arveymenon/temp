import { Component, ViewChild, NgZone } from "@angular/core";
import { IonicPage, NavController, NavParams, ToastController, ModalController, ViewController, Events, PopoverController } from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SchemeDetailsProvider } from "../../providers/scheme-details/scheme-details";
import { UtilityServiceProvider } from "../../providers/utility-service/utility-service";

import * as moment from "moment";
import { Content } from "ionic-angular";
import { ProfileProvider } from "../../providers/profile/profile";
import { AlertController } from "ionic-angular";
import { DomSanitizer } from "@angular/platform-browser";
import { MatStepper } from "@angular/material";
import { Api, User } from "../../providers";
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { EsopStatusProvider } from "../../providers/esop-status/esop-status";
import { PopovertaxPage } from "../popovertax/popovertax";

export interface grant {
  value: string;
  viewValue: string;
}

@IonicPage()
@Component({
  selector: 'page-exercise-now-multi',
  templateUrl: 'exercise-now-multi.html',
})
export class ExerciseNowMultiPage {
  // @ViewChild("myInput") myInputVariable: ElementRef;
  // @ViewChild("myInput1") myInputVariable1: ElementRef;

  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'printform', // the id of html/table element,
    options: { // html-docx-js document options
      orientation: 'portrait',
      margins: {
        top: '20',
        bottom: '20',
        right: '20',
        left: '40'
      }
    }
  }
  IsCurrentDateAvl: any = "";
  /* Final Changes Start */
  exerciseId = 0;
  grantId;
  exerciseStatus;
  /* Final Changes End */
  PerquesiteTax: any;
  uploadFilePath: any;
  uploadedForms: any[];
  uploadPdfSrc: any;
  pdfRef;
  pdfHref = "";
  //@ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild('tabGroup') tabGroup;

  pdf: any;
  pdfParam: any;
  statusSelect: any = {};
  items: any = [];
  summayFinalArray: any;
  summayArray: any[];
  currentScheme: any;
  parentMessage = "message from parent";
  @ViewChild(Content) content: Content;
  public tempAvailableOptions: any;
  isFMVPresent: boolean = false;
  disableconfirm: boolean = true;
  userToken: any;
  MarketPrice: any;
  exerciseData: any;
  selectedIndextab: number;
  scrollToTop() {
    this.content.scrollToTop();
  }

  finalyArrayData = [];
  noOfOptionValue: any;
  calculateDetails: any = [];
  PreClearanceStatus: any = []
  ProceedFurther: any;
  EnableLink: any;

  analysisDetail: any;
  pet: string = "puppies";
  isAndroid: boolean = false;
  public show: boolean = false;
  grant: any[];
  NewFinalArray: any[];

  detailsObj: any = {};

  cancelDetails: any;
  title: any;
  Counter: any;
  percentage: any = 0;
  // code is for material stteper
  LastWorkingMarketClosing: any;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  FMVall: any;
  errorMessage: any;
  allscheme: any;
  paymentGatewayTab = false;
  public rsuGrantMappings = [];
  public employeeExerciseForms = [];
  public schemeMasters = [];
  public schemeVestingMappings = [];
  public individualscheme: any;
  public buttonClicked: boolean = false;
  public card1: boolean = true;
  stepper1 = {
    selectedIndex: 0
  }

  @ViewChild('stepper') stepper: MatStepper;
  // @ViewChild('stepper1') stepper1: MatStepper;


  imageUrls: any = [];
  pdfSrc;
  requestSummaryObj;
  fmvAvl: boolean;
  fromFMVModal: boolean = false;

  newisLinear = false;
  documentOfflineSubmit: boolean = false;

  // public checkStatus:boolean =false;
  grants: grant[] = [
    { value: "steak-0", viewValue: "grant 1" },
    { value: "pizza-1", viewValue: "grant 2" },
    { value: "tacos-2", viewValue: "grant 3" }
  ];
  backAlert: boolean;
  // multiVestingColumns: string[] = ['OptionsGranted','Percentage','VestingDate','LapseDate','VestedOptions',
  // 'Exerciseable', 'UnvestedOptions', 'OptionsLapsed', 'ExercisePrice'];
  multiVestingColumns: string[] = ['VestingDate', 'LapseDate', 'Exerciseable', 'UnvestedOptions',
    'OptionsLapsed', 'CancelledOptionsSum'];

  //new multi 
  finalArrayNew = [];
  checkGrants: boolean[] = [];
  multiGrantSelected: any = [];
  currentExercise: any = [];
  multiSelectedExerciseColumns: string[] = ['SchemeName', 'GrantOptionId', 'OptionsGranted', 'UnvestedOptions',
    'Exerciseable', 'MinimumOptions', 'OptionsOpted', 'ExercisePrice', 'ExerciseAmount', 'PerquisiteValue',
    'PerquesiteTax', 'NetProfit', 'Tax'];

  multiSelectedExerciseArr: any[] = [];
  summaryListLoader: boolean = false;
  grantListLoader: boolean = false;

  closureWindow: boolean = false;
  closureWindowStatus: string = null;
  closureWindowText: string = null;
  isOnHold: boolean = false;
  isOnHoldText: string = null;
  exerciseSummaryColumns: string[] = ['SchemeCode', 'OptionsOpted', 'ExerciseAmount', 'PerquesiteTax', 'PerquisiteValue'];
  insiderEmployee: boolean = false;
  exerciseConfirmAnimate: boolean = false;
  popupDetails: any;

  editPaymentFlag: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _formBuilder: FormBuilder,
    public schemeDetails: SchemeDetailsProvider,
    public utilityProvider: UtilityServiceProvider,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public events: Events,
    public api: Api,
    public viewCtrl: ViewController,
    public ngZone: NgZone,
    public alertCtrl: AlertController,
    private sanitizer: DomSanitizer,
    private exportAsService: ExportAsService,
    private profile: ProfileProvider,
    public esopStatusProvider: EsopStatusProvider,
    public userProv: User,
    public popoverController:PopoverController
  ) {
    this.allscheme = [];
    this.backAlert = false;
    this.isOnHoldText = 'You account is marked as on hold. Please contact HR for any query';
    this.closureWindowText = 'ESOP Exercise Window shall remain closed from 11th to 31st March, 2021 due to yearend.';
  }

  // CreatePopOver() {
  //   this.popover.create({component:PopovertaxPage,
  //     showBackdrop:false}).then((popoverElement)=>{
  //     popoverElement.present();
  //   });
  // }
  popclick(myEvent) {
    let popover =  this.popoverController.create(PopovertaxPage);
     popover.present({
       ev:myEvent
     });
  }

  applicationDownloadWarning(event) {
    const confirm = this.alertCtrl.create({
      title: "Caution!",
      message: "Please note, Application form will be valid & treated as Legitimate document only after exercise is confirmed/completed in the following screen",
      cssClass: "customCommonAlert",
      buttons: [
        {
          text: "I Agree",
          handler: () => {
            this.exerciseConfirmAnimate = true;
            confirm.dismiss();
            this.printNew();
          }
        },
      ]
    });
    confirm.present();
  }

  export(event) {
    this.utilityProvider.presentLoading("", "");
    this.exportAsService.save(this.exportAsConfig, 'Exercise').subscribe(() => {
      this.utilityProvider.dismissLoading();
    }, error => {
      this.utilityProvider.dismissLoading();
    });
  }
  printNew(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printform').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();

    popupWin.document.write(`
      <html>
        <head> 
          <title>Exercise_Form_${this.exerciseData.ExerciseNumber}</title>
          <style>
              table{
                width:100%; 
                border-collapse: collapse;
                font-size: 12px !important
              }
              .main-div{
                margin: 0px !important; 
              }
          </style>
        </head>
    <body onload="window.print();window.close()">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }

  base64ToArrayBuffer(base64) {
    let binary_string = window.atob(base64);
    let len = binary_string.length;
    let bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  }
  generatePDF() { }
  // onclick open modal and also pass the data of scheme
  schemeDetailModal(event, data) {
    let schemeModal = this.modalCtrl.create(
      "SchemeDetailsPage",
      { schemeDetail: data },
      { cssClass: "modal-fullscreen", showBackdrop: false }
    );
    schemeModal.present();
  }

  // parentMessage = "message from parent"

  // material stepper functionality required fields
  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ["", Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ["", Validators.required]
    });
  }

  responseData: any = [];
  finalArray: any = [];
  todayDate = new Date();
  temp: any;
  temp2: any;
  countries: any;

  ionViewDidLoad() {
    this.utilityProvider.presentLoading("", "");

    this.documentOfflineSubmit = false;
    this.exerciseConfirmAnimate = false;
    // this.resetMultiVar();
    this.api.getUserDetails().then(userToken => {
      this.userToken = userToken;
      this.getClosureWindow();
      let data = {
        TokenNumber: this.userToken.EmpID,
        UserName: this.userToken.LoginId,
        DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web"
      };
      this.schemeDetails.schemeDetailInfo(data).subscribe(
        (schemedeails: any) => {
          // debugger; 
          this.allscheme = schemedeails;
          this.employeeExerciseForms = []; //schemedeails.employeeExerciseForms;
          this.employeeExerciseForms.sort(this.sortFunction);
          this.rsuGrantMappings = schemedeails.rsuGrantMappings;
          this.schemeMasters = schemedeails.schemeMasters;
          this.schemeVestingMappings = schemedeails.schemeVestingMappings;

          //Terminator
          this.finalArray = schemedeails.VestedOptionsResult;
          this.utilityProvider.dismissLoading();
          this.getMultiEsopStatus();
          this.getExerciseSummary();
        },

        error => {
          this.errorMessage = <any>error;
          this.utilityProvider.dismissLoading();
        }
      );
      //
      this.anaylysisDetail();
      this.checkFMVValue();
    });

    // this.finalArrayData(data);
  }


  roundOf(value) {
    let val = Math.ceil(value)
    return val;
  }

  dataPdf(ExerciseNo) {
    let data = {
      "ExerciseNo": ExerciseNo
    };
    this.schemeDetails.exercisePdf(data).subscribe(
      (exerciseData: any) => {
        if (exerciseData["ID"] == 1) {
          this.exerciseData = exerciseData["ResponseData"][0];
        }

      },
      error => {
        this.errorMessage = <any>error;
        this.utilityProvider.dismissLoading();
      }
    );
  }


  ShowDataschemeDetailInfo() {
    let data = {
      TokenNumber: this.userToken.EmpID,
      UserName: this.userToken.LoginId,
      DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web"
    };
    this.schemeDetails.schemeDetailInfo(data).subscribe(
      (schemedeails: any) => {
        this.allscheme = schemedeails;
        this.employeeExerciseForms = schemedeails.employeeExerciseForms;
        this.employeeExerciseForms.sort(this.sortFunction);
        this.rsuGrantMappings = schemedeails.rsuGrantMappings;
        this.schemeMasters = schemedeails.schemeMasters;
        this.schemeVestingMappings = schemedeails.schemeVestingMappings;

        //Terminator
        this.finalArray = schemedeails.VestedOptionsResult;
        this.getMultiEsopStatus();
      },

      error => {
        this.errorMessage = <any>error;
        this.utilityProvider.dismissLoading();
      }
    );
  }

  sortFunction(a, b) {
    var dateA = new Date(a.ExerciseDate).getTime();
    var dateB = new Date(b.ExerciseDate).getTime();
    return dateB > dateA ? 1 : -1;
  }

  terminator() {
    this.finalArray.forEach((element, inx, arr) => {
      arr[inx]["UnvestedOptions"] =
        element.OptionsGranted - element.VestedOptions;
    });
  }

  checkFMVValue() {
    let data = {

      UserName: this.userToken.LoginId,
      DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web",
      IsMobile: true,
      IsWeb: true
    };
    this.schemeDetails.checkFMVValue(data).subscribe((resp: any) => {
      if (resp.FMV !== null) {

        this.isFMVPresent = true;
        this.FMVall = resp;
        this.LastWorkingMarketClosing = resp.LastWorkingMarketClosing;
      }
    });
  }
  openDISlip() {
    this.navCtrl.push("DiSlipPage");
  }
  requestSummary(data) {

  }
  summation(arr, key) {
    return arr.reduce((sum, item) => sum + (parseInt(item[key]) || 0), 0);
  }
  traverseScheme() {
    this.finalArray = [];
    this.schemeMasters.forEach(item => {
      this.checkCondition(item);
    });
  }

  initializeArray(item) {
    item.GrantID = this.getGrantID(item); // Add GrantId Key value Pair in schemeMaster Array dynamically.
    item.VestingInfo = this.getVestingInfo(item);
  }

  checkCondition(data: any) {


    if (data.SchemeValidFrom === "v" || data.SchemeValidFrom === "V") {
      let allocationDate = this.getAllocationDate(data);
      let lapseDate = this.getLapsedDate(data);
      let Year =
        new Date(lapseDate).getFullYear() -
        new Date(allocationDate).getFullYear();
      let tempdate = new Date(allocationDate);

      let newDate = new Date(
        tempdate.setMonth(tempdate.getMonth() + data.VestingMonths)
      );


      data.year = Year;
      if (newDate <= this.todayDate) {
        this.checkPeriodforV(data, newDate, "lessDate");
      } else {
        this.checkPeriodforV(data, newDate, "");
      }
    }

    if (data.SchemeValidFrom === "g" || data.SchemeValidFrom === "G") {
      let allocationDate = new Date(this.getAllocationDate(data));
      let lapseDate = this.getLapsedDate(data);
      let Year =
        new Date(lapseDate).getFullYear() -
        new Date(allocationDate).getFullYear();

      data.year = Year;

      if (allocationDate <= this.todayDate) {
        this.checkPeriodforG(data, allocationDate, "lessDate");
      } else {
        this.checkPeriodforG(data, allocationDate, "");
      }
    }
  }

  getAllocationDate(data) {
    let foundObj = this.allscheme.rsuGrantMappings.find(
      obj => obj.SchemeID == data.SchemeID
    );
    return foundObj.AllocationDate;
  }

  getLapsedDate(data) {
    let foundObj = this.allscheme.schemeVestingMappings.find(
      obj => obj.SchemeID == data.SchemeID
    );
    //alert("get Lapsed Date"+JSON.stringify(foundObj) );
    return foundObj ? foundObj.LapseDate : moment().toISOString();
  }
  checkPeriodforV(data, newDate, dateCondition) {

    this.percentage = this.allscheme["schemeVestingMappings"][0].Percentage;

    // debugger;
    let idwiseArray = this.allscheme.schemeVestingMappings.filter(
      obj => obj.SchemeID === data.SchemeID
    );
    let lastLapsedDate = idwiseArray[idwiseArray.length - 1].LapseDate;

    // let newObject=this.allocationDate - lastLapsedDate;

    let tempDate: any;
    //let percentage:number

    for (let i = 0; i < idwiseArray.length - 1; i++) {
      tempDate = moment(newDate).add(idwiseArray[i].Months, "M");

      if (moment(tempDate).utc() <= moment(this.todayDate).utc()) {
        this.percentage = this.allscheme["schemeVestingMappings"][i].Percentage;
        continue;
      } else {
        let vestedOption =
          dateCondition === "lessDate"
            ? (this.percentage * this.getOptionGranted(data)) / 100
            : 0;
        let unvestedOption = this.getOptionGranted(data) - vestedOption;


        let foundObj = this.allscheme.rsuGrantMappings.find(
          obj => obj.SchemeID === data.SchemeID
        );
        foundObj.totalGrant = this.getOptionGranted(data);
        foundObj.VestedOption = vestedOption;
        foundObj.SchemeName = data.SchemeName;
        foundObj.ExercisePrice = data.ExercisePrice;
        foundObj.LapseDate = idwiseArray[i].LapseDate;
        foundObj.IsActive = data.IsActive;
        foundObj.year = data.year;
        foundObj.unvestedOption = unvestedOption;
        foundObj.currentSchemeVestingID = idwiseArray[i].SchemeVestingID;

        foundObj.GrantID = this.getGrantID(data); // Add GrantId Key value Pair in schemeMaster Array dynamically.
        foundObj.VestingInfo = this.getVestingInfo(data);
        foundObj.VestingMonth = idwiseArray[i].Months;

        this.finalArray.push(foundObj);


        this.requestSummary(this.finalArray);

        break;
      }
    }
  }
  getGrantID(data) {
    let foundObj = this.rsuGrantMappings.find(
      obj => obj.SchemeID === data.SchemeID
    );
    return foundObj.ID;
  }
  getVestingInfo(data) {
    let temp = this.schemeVestingMappings.filter(item => {
      return item.SchemeID === data.SchemeID;
    });
    return temp;
  }
  checkPeriodforG(data, allocationDate, dateCondition) {
    let idwiseArray = this.allscheme.schemeVestingMappings.filter(
      obj => obj.SchemeID === data.SchemeID
    );
    let tempDate: any;


    let vestedOptions = 0;
    let unvestedOptions = 0;
    let lapsedOptions = 0;
    let exercisedOptions = 0;
    let transactedOptions = 0;
    let currentExercisedOptions = 0;
    let vestings = [];
    let currentStartDate;
    let currentLapseDate;
    let availableOptions = 0;

    //let percentage:number;
    let exerciseDetails = this.employeeExerciseForms.filter(
      obj => obj.SchemeID === data.SchemeID
    );
    for (let i = 0; i < exerciseDetails.length; i++) {
      if (exerciseDetails[i].Approval == "D") {
        exercisedOptions += exerciseDetails[i].OptionsOpted;
        /*if(){

        }*/
      }
      if (exerciseDetails[i].Approval != "R") {
        transactedOptions += exerciseDetails[i].OptionsOpted;
      }
    }
    let foundObj = this.allscheme.rsuGrantMappings.find(
      obj => obj.SchemeID === data.SchemeID
    );
    for (let i = 0; i < idwiseArray.length; i++) {
      //let tempDate = new Date(allocationDate.setMonth(allocationDate.getMonth()+idwiseArray[i].Months));
      let startDate = moment(allocationDate).add(idwiseArray[i].Months, "M");
      let today = moment(this.todayDate);
      let lapseDate = moment(idwiseArray[i].LapseDate);
      let currentVesting = false;
      let percentage = idwiseArray[i].Percentage;
      let vestingScheduleOptions =
        (percentage * this.getOptionGranted(data)) / 100;

      //unvestedOptions += percentage * this.getOptionGranted(data) / 100;

      if (startDate <= today) {
        vestedOptions += (percentage * this.getOptionGranted(data)) / 100;
      }
      if (startDate <= today && today <= lapseDate) {
        currentVesting = true;

        if (!currentStartDate) currentStartDate = startDate;
        currentLapseDate = lapseDate;
      } else if (startDate > today) {
        unvestedOptions += (percentage * this.getOptionGranted(data)) / 100;
      } else if (startDate < today && today > lapseDate) {
        //lapsed options
      }

      //VestingInfo Extra Details
      idwiseArray[i]["StartDate"] = startDate;
      idwiseArray[i]["CurrentVesting"] = currentVesting;
      idwiseArray[i]["Options"] = vestingScheduleOptions;
    }

    availableOptions = vestedOptions - transactedOptions;
    foundObj.totalGrant = this.getOptionGranted(data);
    foundObj.SchemeName = data.SchemeName;
    foundObj.ExercisePrice = data.ExercisePrice;
    foundObj.GrantID = this.getGrantID(data); // Add GrantId Key value Pair in schemeMaster Array dynamically.
    //foundObj.VestingInfo = this.getVestingInfo(data);
    foundObj.VestingInfo = idwiseArray;

    foundObj.year = data.year;
    foundObj.AvailableOptions = availableOptions;
    foundObj.ExercisedOptions = exercisedOptions;
    foundObj.VestedOption = vestedOptions;
    foundObj.unvestedOption = unvestedOptions;
    foundObj.vestings = vestings;
    foundObj.StartDate = currentStartDate;
    foundObj.LapseDate = currentLapseDate;
    foundObj.availableOptions = vestedOptions;
    this.finalArray.push(foundObj);
  }

  getOptionGranted(data) {
    let foundObj = this.allscheme.rsuGrantMappings.find(
      obj => obj.SchemeID === data.SchemeID
    );
    return foundObj.OptionsGranted;
  }
  isNumber(evt) {
    evt = evt ? evt : window.event;
    var charCode = evt.which ? evt.which : evt.keyCode;
    if (charCode < 48 || charCode > 57) {
      return false;
    } else {
      return true;
    }
  }

  openGrantDetails(data, i) {
    this.utilityProvider.checkStatus = false;
    this.requestSummaryObj = null;
    this.detailsObj = data;
    this.detailsObj.curInx = i;
    this.schemeVestingMappings;
    let dataScheme = this.schemeVestingMappings.filter(
      obj => obj.SchemeID === this.detailsObj.SchemeID
    );

    this.detailsObj["schemeVestingPeriod"] = dataScheme;
    setTimeout(() => {
      this.utilityProvider.checkStatus = true;
      let uploadForm = this.modalCtrl.create("ExerciseInfoModalPage", this.detailsObj, { cssClass: 'exerciseInfoPopup' })
      uploadForm.present();
    }, 100);
    this.utilityProvider.infoPanel = false;
  }

  openReqSummDetails(data) {
    this.requestSummaryObj = data;
    this.cancelDetails = data;
    this.utilityProvider.rejectionPannel = true;
    let uploadForm = this.modalCtrl.create("ExerciseSummaryModalPage", this.requestSummaryObj, { cssClass: 'exerciseSummaryPopup' })
    uploadForm.present();
    //this.utilityProvider.infoPanel = false; 
    this.utilityProvider.checkStatus = false;

  }
  goToNextTab(data) {
    let params =
    {
      "TokenNumber": this.userToken.EmpID,
      "UserName": this.userToken.LoginId,
      "DeviceNumber": "web",
      "IsMobile": true,
      "IsWeb": false
    };
    this.schemeDetails.checkAccountStatus(params).subscribe((res1: any) => {
      if (res1.AccountStatus === true) {
        let params2 = {
          TokenNumber: this.userToken.EmpID,
          UserName: this.userToken.LoginId,
          DeviceNumber: "web",
          SchemeID: data.SchemeID,
          IsMobile: 0,
          IsWeb: 1
        }
        this.schemeDetails.getEsopStatusVesting(params2).subscribe((res2: any) => {
          this.utilityProvider.checkStatus = false;
          this.detailsObj = data;
          res2['VestedOptionsResult'].forEach(element => {
            element['CancelledOptionsSum'] = (element['CancelledOptions'] + element['CancelledOptionsExerciseable']) || 0;
          });
          this.detailsObj['MultiVestedOptionsResult'] = res2['VestedOptionsResult'];
          this.tempAvailableOptions = this.detailsObj.AvailableOptions;
          this.statusSelect = data;
          this.stepper.next();
        })
      } else {
        // this.utilityProvider.presentToast("Your Demat account is not active, kindly check with Trust", 6000, 'top');
        this.utilityProvider.presentToast(res1.message, 6000, 'top')

      }
    })
  }
  finalArrayData(data) {
    this.finalyArrayData = data;
  }
  openPanel() {
  }
  toggle(data) {
    this.show = !this.show;
  }
  public closeModal() {
    this.show = !this.show;
  }
  getNationality() {
    if (this.exerciseData && this.exerciseData.Nationality) {
      return this.exerciseData.Nationality.toUpperCase() == 'INDIA' ? 'Indian' : this.exerciseData.Nationality;
    }
    else {
      return 'N/A';
    }
  }
  calculateAnalysisDeatils() {
    if (this.MarketPrice > 0) {
      this.utilityProvider.presentLoading("", "");
      this.detailsObj.curInx = this.finalArray.findIndex(
        x => x.SchemeID === this.detailsObj.SchemeID
      );

      let minOptions = this.finalArray[this.detailsObj.curInx].MinimumOptions;
      if (
        this.noOfOptionValue <=
        this.finalArray[this.detailsObj.curInx].Exerciseable
      ) {
        if (minOptions === null || this.noOfOptionValue >= minOptions || this.detailsObj.Exerciseable <= minOptions) {
          let data = [
            {
              TokenNumber: this.userToken.EmpID,
              UserName: this.userToken.LoginId,
              GrantOptionId: this.detailsObj.GrantOptionId,
              ExercisePrice: this.detailsObj.ExercisePrice,
              NoOfOption: this.noOfOptionValue,
              BonusPercent: this.detailsObj.BonusPercent,
              DeviceNumber:
                this.utilityProvider.getDeviceDetails().deviceId || "web",
              IsMobile: true,
              IsWeb: true,
              // MarketPrice: this.utilityProvider.marketPrice
              MarketPrice: 0
            }
          ];


          this.schemeDetails.whatIfAnalysisDetails(data).subscribe(
            items => {
              this.calculateDetails = items;
              this.PerquesiteTax = this.calculateDetails[0].PerquesiteTax;
              this.fmvAvl = this.calculateDetails[0].IsCurrentDateAvl;
              if (this.LastWorkingMarketClosing) {
                this.utilityProvider.presentAlert(
                  "",
                  `Dear User, today's FMV is not generated yet. You may proceed with simulation using available tentative current price ${this.calculateDetails[0].MarketPrice}`
                  // "Current FMV is not available. Your perquisite tax is calculated on previous fmv."
                );
              }

              this.backAlert = true;
              this.utilityProvider.dismissLoading();
            },
            error => {
              this.errorMessage = <any>error;
              this.utilityProvider.dismissLoading();
            }
          );
        } else {
          this.utilityProvider.presentToast(
            `Mininmum options can be exercise is ${this.finalArray[this.detailsObj.curInx].MinimumOptions
            }`,
            3000,
            "top"
          );
          this.utilityProvider.dismissLoading();
        }
      } else {
        this.utilityProvider.presentToast(
          "You dont have enough options to exercise..",
          3000,
          "top"
        );
        this.utilityProvider.dismissLoading();
      }
    } else {
      this.utilityProvider.presentToast(
        "FMV is not present,Kindly contact Trust to enter price.",
        3000,
        "top"
      );
    }
  }
  recalculate(i, data) {
    this.fromFMVModal = false;
    // let modal = this.modalCtrl.create("FmvRecalculateModalPage", data);
    let modal = this.modalCtrl.create("FmvRecalculateModalPage", data, { cssClass: 'FMVRecalculateModal' });
    modal.present();
    modal.onDidDismiss(data => {
      if (data != null) {
        this.detailsObj = data;
        this.exerciseId = data.ID;
        this.PerquesiteTax = data.PerquisiteTax;
        this.noOfOptionValue = data.OptionsOpted;
        this.fromFMVModal = true;
        this.detailsObj.Approval = 'Q';
        this.currentExercise = data;
        this.currentExercise.Approval = 'Q';
        this.ShowDataschemeDetailInfo();
        //  this.stepper.selectedIndex = 2;  
        this.getPDFDataToThirdTab();
      }
    });
  }

  completeDocumentProcedure(data, opts?: 'editpayment') {
    console.log(data);
    this.editPaymentFlag = false;
    if (data.Approval === "D" || data.Approval === "P") {
      if (opts == 'editpayment') {
        this.editPaymentFlag = true;
        this.moveConfirmStepper(1);
        setTimeout(() => {
          data.Approval = 'O';
        }, 1000);
      } else {
        this.moveConfirmStepper(2);
      }
    } else if (data.Approval === "I" || data.Approval === "Q" || data.Approval === "O") {
      this.moveConfirmStepper(1);
    } else {
      this.moveConfirmStepper(0);
    }
    this.detailsObj = data;
    this.exerciseId = data.ID;
    this.PerquesiteTax = data.PerquisiteTax;
    this.noOfOptionValue = data.OptionsOpted;
    this.currentExercise = data;
    this.ShowDataschemeDetailInfo();
    //  this.stepper.selectedIndex = 2;  
    this.getPDFDataToThirdTab();
  }

  goToTab(n) {

    this.stepper.selectedIndex = n;
  }

  goToTabSelect1() {
    this.uploadedForms[0].fileData = '';
    this.uploadedForms[1].fileData = '';
    this.stepper.selectedIndex = 1;
    this.disableconfirm = true;
    // this.selectedIndextab=0;
    this.tabGroup.selectedIndex = 0;
  }

  confirmDematDetails() {
    let data = {
      TokenNo: this.userToken.EmpID
    }
    this.utilityProvider.presentLoading('Please wait...', '');
    this.profile.getDematAccount(data).subscribe((res) => {
      this.utilityProvider.dismissLoading();
      let dematAccModal = this.modalCtrl.create("DematAccountDetailsViewPage", res, { cssClass: 'dematAccountDeatilsModal' });
      dematAccModal.present();
      dematAccModal.onDidDismiss((res) => {
        if (!res)
          return false;
        if (res === "c") {
          let action = this.calculateDetails[0].IsCurrentDateAvl ? 'Q' : 'I';
          this.onExercisesave(action);
        } else if (res === "p") {
          this.onExercisesave('S');
          this.navCtrl.setRoot("ProfilePage", { fromExerciseNow: true });
        }
      })
    }, err => {
      this.utilityProvider.dismissLoading();
      this.utilityProvider.presentToast('Please try again later.', 3000, 'top');
    })
  }

  onExercisesave(action?) {
    if (this.MarketPrice > 0) {
      this.utilityProvider.presentLoading("", "");
      let exerciseable = this.detailsObj.Exerciseable + this.detailsObj.Exerciseable_B;
      if (this.noOfOptionValue <= exerciseable) {
        let data = {
          ExerciseID: this.exerciseId,
          OptionsOpted: this.noOfOptionValue,
          Approval: action,
          TokenNumber: this.userToken.EmpID,
          UserName: this.userToken.LoginId,
          DeviceNumber:
            this.utilityProvider.getDeviceDetails().deviceId || "web",
          IsMobile: true,
          IsWeb: true,
          SchemeID: this.detailsObj.SchemeID,
          ExerciseDate: new Date()
        };
        this.schemeDetails.saveExercise(data).subscribe(
          items => {
            this.utilityProvider.dismissLoading();
            this.backAlert = false;
            this.exerciseId = items["ExerciseID"];
            this.ShowDataschemeDetailInfo();
            if (action == "S") {
              this.stepper.selectedIndex = 0;
              this.utilityProvider.presentToast(
                "Your Record has been saved successfully..",
                3000,
                "top"
              );
              this.noOfOptionValue = "";
            } else if (action == "Q" && !this.LastWorkingMarketClosing) {
              this.detailsObj.Approval = 'Q';
              this.detailsObj.TokenNumber = this.userToken.EmpID;
              this.detailsObj.OptionsOpted = this.noOfOptionValue;;
              this.detailsObj.OfferedPrice = items["OfferedPrice"];
              this.detailsObj.ExerciseNumber = items["ExerciseNumber"];
              this.detailsObj.PerquisiteTax = this.PerquesiteTax;
              this.getPDFDataToThirdTab();
            } else {
              this.utilityProvider.presentToast(
                "This request has been calculated on previous FMV. You will have to recalculate when the FMV is available.",
                10000,
                "top"
              );
              this.stepper.selectedIndex = 0;
            }
          },
          error => {
            this.utilityProvider.dismissLoading();
            this.errorMessage = <any>error;
          }
        );

        // }
      } else {
        this.utilityProvider.presentToast(
          "You dont have enough options to exercise..",
          3000,
          "top"
        );
      }
    } else {
      this.utilityProvider.presentToast(
        "FMV is not present,Kindly contact Trust to enter price.",
        3000,
        "top"
      );
    }
  }

  anaylysisDetail() {
    // alert("in analysis");
    let data = {
      EmpCode: this.userToken.EmpID,
      UserName: this.userToken.LoginId,
      DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web",
      IsMobile: false,
      IsWeb: true
    };

    this.schemeDetails.whatIfAnalysis(data).subscribe(
      items => {
        // alert(JSON.stringify(items));
        this.analysisDetail = items;
        this.MarketPrice = this.analysisDetail["MarketPrice"];
        this.IsCurrentDateAvl = this.analysisDetail["IsCurrentDateAvl"];
      },
      error => (this.errorMessage = <any>error)
    );
  }

  onEditGetExercise(data) {
    //alert(data['ID']);
    this.exerciseId = data["ID"];
    let summaryArray = this.finalArray.find(
      obj => obj.SchemeID == data.SchemeID
    );

    this.noOfOptionValue = data.OptionsOpted;
    this.goToNextTab(summaryArray);
    // this.anaylysisDetail();
  }

  cancelData(i, data, remarks?) {
    let cancelData = {
      Approval: "C",
      TokenNumber: this.userToken.EmpID,
      UserName: this.userToken.LoginId,
      // "UserName": JSON.parse(this.utilityProvider.getSessionStorage('userDetails'))['LoginId'],
      DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web",
      IsMobile: true,
      IsWeb: true,
      //  "TokenNumber": JSON.parse(this.utilityProvider.getSessionStorage('userDetails'))['EmpID'],
      SchemeID: data.SchemeID,
      ExerciseId: data.ID,
      ExerciseDate: new Date(),
      Remarks: remarks || ""
    };
    this.schemeDetails.saveExercise(cancelData).subscribe(
      items => {
        //  alert("cancel Record");
        this.utilityProvider.presentToast(
          "Your Record is deleted successfully..",
          3000,
          "top"
        );

        this.closeReqSummary();
        this.ionViewDidLoad();
      },
      error => (this.errorMessage = <any>error)
    );
  }

  // }
  openUrl() {
    this.utilityProvider.openUrl(
      "https://www.google.com/",
      "_system",
      "location=yes"
    );
  }
  callType(event) {

  }
  uploadPic() {
    this.schemeDetails.uploadPic();
  }



  async convertToBase64(file) {
    return new Promise((resolve, reject) => {
      const picReader = new FileReader();
      picReader.onload = (e: any) => {
        const picFile = e.target;
        resolve(picReader.result);
        // resolve([(picReader.result).toString().split(",")[1],picFile.result]);
      };
      picReader.readAsDataURL(file);
    })
  }
  async onFileChangeFirstTab($event, i) {
    this.imageUrls[i] = await this.convertToBase64($event.target.files[0]);
  }



  async setFiles(id, event, param, j) {
    let files = event.target.files[0];
    let name = files.name;

    let ext = name.split(".").pop().toLowerCase();

    this.uploadedForms[j]['ext'] = ext;

    if (ext !== "png" && ext !== "jpg" && ext !== "jpeg" && ext !== "pdf") {
      this.utilityProvider.presentToast("Please upload a valid file .PNG .JPG .JPEG .PDF", 4000, 'top');
      this.uploadedForms[j]["fileTypeError"] = true;
      return false;
    } else if (files.size > 5000000) {
      this.utilityProvider.presentToast("This file exceeds the 5Mb limit.", 4000, 'top');
      return false;
    } else {
      this.uploadedForms[j]["fileName"] = files.name;
      this.uploadedForms[j]["fileTypeError"] = false;
      this.uploadedForms[j]['fileData'] = await this.convertToBase64(event.target.files[0]);
    }




    this.schemeDetails.setFilesData(event, id).subscribe(data => {

      let dataResp = {
        ExerciseId: id.ExerciseID
      };
      this.schemeDetails.getExercise(dataResp).subscribe(items => {

        if (param == 1) {
          this.disableconfirm = this.documentOfflineSubmit ? false : true;
        } else if (param == 2) {
        }

      },
        error => (this.errorMessage = <any>error)
      );
    });
  }




  DownLoadPdf(val) {

    let linkSource = 'data:application/pdf;base64,' + val['fileData'].split(",")[1];
    const downloadLink = document.createElement("a");
    const fileName = "Download124.pdf";

    downloadLink.href = linkSource;
    downloadLink.download = val.FormName + val.ext;
    downloadLink.click();

  }
  downloadDocument(link) {
    if (link) {
      window.open(link);
    } else {
      this.utilityProvider.presentToast('Document is not available', 3000, 'top');
    }
  }

  DownloadDoc(val) {
    // alert(val);
  }

  adf() {

  }


  RedirectReject() {
    this.navCtrl.push("PreclearanceListEmpPage");
  }

  getPDFDataToThirdTab() {
    let exerciseParams = {
      ExerciseId: this.exerciseId
    };
    this.schemeDetails.getExercise(exerciseParams).subscribe(
      items => {
        this.dataPdf(this.exerciseId);
        if (this.uploadedForms == undefined) {
          this.uploadedForms = items["Forms"];
        }
        this.stepper.selectedIndex = 2;
      },
      error => (this.errorMessage = <any>error)
    );
  }
  convertDataURIToBinary(dataURI: string) {
    var raw = window.atob(dataURI);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));

    for (var i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  }
  selectFile(e) {

  }
  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  openConfirmAlert(i, data) {
    const confirm = this.alertCtrl.create({
      title: "Want to delete?",
      message: "Are you sure you want to discard this draft?",
      cssClass: "customCommonAlert",
      buttons: [
        {
          text: "No ",
          handler: () => {

          }
        },
        {
          text: "Yes",
          handler: () => {

            this.cancelData(i, data);
          }
        }

      ]
    });
    confirm.present();
  }
  completeExercise() {
    const confirm = this.alertCtrl.create({
      title: "Confirm Exercise",
      message: "Are you sure you want to confirm your transaction?",
      cssClass: "customCommonAlert",
      buttons: [
        {
          text: "Cancel",
          handler: () => {

          }
        },
        {
          text: "Confirm",
          handler: () => {

            this.utilityProvider.presentLoading("", "");
            let data = {
              ExerciseID: this.exerciseId,
              SchemeID: null,
              TokenNumber: this.userToken.EmpID,
              UserName: this.userToken.LoginId,
              //  "TokenNumber": JSON.parse(this.utilityProvider.getSessionStorage('userDetails'))['EmpID'],
              ExercisePrice: null,
              OptionsOpted: null,
              PerquisiteTax: this.PerquesiteTax,
              Approval: "P",
              //   "UserName": JSON.parse(this.utilityProvider.getSessionStorage('userDetails'))['LoginId'],
              DeviceNumber:
                this.utilityProvider.getDeviceDetails().deviceId || "web",
              IsMobile: true,
              IsWeb: true
            };

            this.schemeDetails.submitExercise(data).subscribe(
              items => {
                this.utilityProvider.presentToast(
                  "Your transaction is successful. Please wait for approval.",
                  6000,
                  "top"
                );
                this.clearForm("thirdTab");
                this.stepper.selectedIndex = 0;
                this.ionViewDidLoad();
                //  this.utilityProvider.dismissLoading();
              },
              error => {
                this.errorMessage = <any>error;
                this.utilityProvider.dismissLoading();
              }
            );
          }
        }
      ]
    });
    confirm.present();
  }

  openFileNow(url) {
    if (url != null) {
      window.open(url, '_blank');
    }
  }

  onChange(id, event) {
    //this.setFiles(id, event);
  }
  clearForm(tab?) {

    if (tab === "secondTab") {
      if (!this.backAlert) {

        this.exerciseId = 0;
        this.noOfOptionValue = "";
        this.calculateDetails = [];
        this.backAlert = false;
        this.stepper.selectedIndex = 0;
        this.checkGrants = [];
        this.resetMultiVar();
        this.ionViewDidLoad();
      } else if (this.backAlert === true) {
        let alertCtrl = this.alertCtrl.create({
          title: '',
          message: 'Are you sure you want to go back?',
          cssClass: "customCommonAlert noTitle",
          buttons: [

            {
              text: 'No',
              handler: () => { }
            },
            {
              text: 'Yes',
              handler: () => {
                //this.finalArray = [];
                this.exerciseId = 0;
                this.noOfOptionValue = "";
                this.calculateDetails = [];
                this.backAlert = false;
                this.stepper.selectedIndex = 0;
                this.resetMultiVar();
                this.ionViewDidLoad();
              }
            }
          ]
        })
        alertCtrl.present();
      }
    }
    if (tab == "thirdTab") {
      this.exerciseId = 0;
      this.noOfOptionValue = "";
      this.calculateDetails = [];
      this.uploadedForms = [];
      this.resetMultiVar();
    }
  }
  closeReqSummary() {
    this.requestSummaryObj = null;
  }
  ionViewDidLeave() {
    this.utilityProvider.checkStatus = false;
  }
  confirmRemarksAlert(i, data) {
    let prompt = this.alertCtrl.create({
      title: "Tell us why you want to cancel this transaction",
      cssClass: "customCommonAlert",
      message: "",
      inputs: [
        {
          name: "remarks",
          placeholder: "Enter Your Remarks"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          handler: data => {

          }
        },
        {
          text: "Ok",
          handler: inputData => {

            let cancelData = {
              Approval: "C",
              TokenNumber: this.userToken.EmpID,
              UserName: this.userToken.LoginId,
              //"UserName": JSON.parse(this.utilityProvider.getSessionStorage('userDetails'))['LoginId'],
              DeviceNumber:
                this.utilityProvider.getDeviceDetails().deviceId || "web",
              IsMobile: true,
              IsWeb: true,
              //"TokenNumber": JSON.parse(this.utilityProvider.getSessionStorage('userDetails'))['EmpID'],
              SchemeID: data.SchemeID,
              ExerciseId: data.ID,
              ExerciseDate: new Date(),
              Remarks: inputData.remarks || ""
            };

            this.schemeDetails.saveExercise(cancelData).subscribe(
              items => {
                this.ionViewDidLoad();
              },
              error => (this.errorMessage = <any>error)
            );
          }
        }
      ]
    });
    prompt.present();
  }

  openPopupModal(popupData, exerciseData, type: 'cheque' | 'utr') {
    let popup = this.modalCtrl.create("DynamicPopupPage", { popupData }, { cssClass: 'dynamicPopupModal' });
    popup.onDidDismiss((res) => {

      if (res) {
        if (res.Action == 'Yes') {
          if (type === 'cheque' || type === 'utr') {
            this.payOffline(exerciseData, type);
          }
        } else if (res.Action == 'No') {
          //take 'No' action if any
        }
        let params = {
          TokenNo: this.userToken.EmpID,
          PageName: "ExerciseNowMultiPage",
          PopupId: this.popupDetails.PopupId,
          ButtonSelected: res
        };
        this.popupAction(params);
      }
    })
    popup.present()
  }

  showPopup(exerciseData, type: 'cheque' | 'utr') {
    this.paymentGatewayTab = false;
    let params = {
      PageName: "ExerciseNowMultiPage"
    }
    this.userProv.getPopupData(params).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.popupDetails = res[0];
        this.openPopupModal(res[0], exerciseData, type);
      } else {
        this.utilityProvider.presentToast("Popup message is not available.", 3000, 'top')
      }
    })
  }

  popupAction(params) {
    this.userProv.clickPopup(params).subscribe((res: any) => {
    })
  }

  payOffline(data, type: 'cheque' | 'utr') {
    let params =
    {
      "TokenNumber": this.userToken.EmpID,
      "UserName": this.userToken.LoginId,
      "DeviceNumber": "web",
      "IsMobile": true,
      "IsWeb": false
    };
    this.schemeDetails.checkAccountStatus(params).subscribe((res: any) => {
      if (res.AccountStatus === true) {
        data["ID"] = this.exerciseId;
        data["isUTR"] = type == 'utr' ? true : false;
        data["PerquisiteTax"] = this.summation(this.exerciseData.ListSchemes, "PerquisiteTaxPayable")
        data["ExerciseAmount"] = this.summation(this.exerciseData.ListSchemes, "ExerciseAmountPayable")

        let analysisModal = this.modalCtrl.create(
          "PayOfflineModalPage",
          { data: data },
          { cssClass: "PayOfflineModal" }
        );
        analysisModal.onDidDismiss(data => {
          if (data) {
            this.currentExercise.Approval = 'D';
            if (this.multiSelectedExerciseArr.length > 0) {
              this.currentExercise.ExerciseDate = this.multiSelectedExerciseArr[0]['ExerciseDate'];
            } else {
              this.currentExercise.ExerciseDate = this.detailsObj.ExerciseDate;
            }
            for (let i = 0; i < this.multiSelectedExerciseArr.length; i++) {
              this.multiSelectedExerciseArr[i]['Approval'] = "D";
            }
            this.getPDFDataToThirdTab();
            this.moveConfirmStepper(2);
          }
          this.ionViewDidLoad();
        });
        analysisModal.present();
      } else {
        this.utilityProvider.presentToast("Your Demat account is not active, kindly check with Trust", 6000, 'top')
      }
    })
  }

  viewPaymentDetail(val: any) {
    let data = {
      ExerciseNumber: val
    }
    val['ExerciseRequestID'] = (val['ExerciseRequestID']) ? val['ExerciseRequestID'] : val['ID'];
    let analysisModal1 = this.modalCtrl.create("PaymentListModalPage", { "data": val }, { cssClass: 'PayDetailListModal' })
    analysisModal1.onDidDismiss(data => {
      if (data != null) {
        if (data.check == 'update') {
          // this.getPaymentList({ pageIndex: 0, pageSize: 10, length: this.pageSize });
        }
        this.exerciseConfirmAnimate = data.viewPaymentApplicationDownloaded;
      }
    });
    analysisModal1.present();
  }
  checkBonus(val) {
    return (val !== null && val !== 0) ? true : false;
  }


  //New Multi Exercise Logic
  resetMultiVar() {
    this.checkGrants = [];
    this.multiGrantSelected = [];
    this.multiSelectedExerciseArr = [];
    this.currentExercise = [];
  }
  getMultiEsopStatus() {
    // let data = { TokenNumber: "208627", UserName: "208627", DeviceNumber: "web" };
    let data = {
      TokenNumber: this.userToken.EmpID,
      UserName: this.userToken.LoginId,
      DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web"
    };
    this.grantListLoader = true;
    this.schemeDetails.getEsopStatusNew(data).subscribe((res: any) => {
      this.grantListLoader = false;
      this.finalArrayNew = res;
    }, error => {
      this.grantListLoader = false;
    })
  }

  getExerciseSummary() {
    let data = {
      TokenNumber: this.userToken.EmpID,
      UserName: this.userToken.LoginId,
      DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web"
    }
    this.summaryListLoader = true;
    this.schemeDetails.getExerciseSummary(data).subscribe((res: any) => {
      this.summaryListLoader = false;
      this.employeeExerciseForms = res;
    }), error => {
      this.summaryListLoader = false;
    };
  }

  precleranceExceed() {

    //this.navCtrl.push("PreclearanceNewPage",{DataEditTrading:'EsopExercise'});
    this.navCtrl.push("PreclearancehistoryPage")
  }

  selectGrantsToExercise(grant, e, i) {
    let chk = e.checked;
    this.checkGrants[i] = chk;
    if (chk) {
      let inx = this.multiGrantSelected.findIndex(x => x.SchemeID == grant.SchemeID);
      if (inx < 0)
        this.multiGrantSelected.push(grant);
    } else {
      let inx = this.multiGrantSelected.findIndex(x => x.SchemeID == grant.SchemeID);
      this.multiGrantSelected.splice(inx, 1);
    }

  }

  checkGrantExercisable(grant) {
    if (grant.Status == false || grant.Exerciseable < 1 || grant.MaximumOptions == 0) {
      return false;
    } else {
      return true;
    }
  }

  grantErrorText(grant) {
    let msg = '';
    if (grant.Status == false || grant.Exerciseable < 1) {
      msg = `Grant is not exerciseable`;
    } else if (grant.MaximumOptions == 0) {
      msg = `Pre-clearance is Pending/Required to exercise this Grant`;
      // msg = `This grant is not permissible to exercise at this time. Please take pre-clearance to exercise this grant.`;
    }
    return msg;
  }

  checkExerciseProceed() {
    if (this.multiGrantSelected.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  confirmExerciseProceed() {
    if (!this.insiderEmployee) {
      this.proceedToExercise();
    }
    else {
      let title = 'Insider Employee';
      let message = `I am aware tha in view of new requirement of SEBI Regulation where the aggregate value of the M&M securities traded by me in a calendar month 
      exceeds Rs.2.50 crores (including market value of ESOPs exercised), Pre-clearance of transaction is required form the Compliance Officer. I confirm 
      that I have obtained / will obtain the necessary pre-clearance in case the value of my trades in a calendar month exceedsRs.2.5 crores. If you click 
      on "Confirm", Please download and sign the form "Declaration by Designated Person" and submit the same along with ESOP Exercise application 
      form to EBF Department. The form is available for download in Home > ESOP Details > FAQs section`;
      let btnText1 = 'Reject';
      let btnText2 = 'Confirm';
      let yes = () => { this.proceedToExercise(); };
      let no = () => { };
      this.utilityProvider.presentConfirmBox(title, message, btnText1, btnText2, yes, no);
    }
  }

  proceedToExercise() {
    this.calculateDetails = [];
    let params =
    {
      "TokenNumber": this.userToken.EmpID,
      "UserName": this.userToken.LoginId,
      "DeviceNumber": "web",
      "IsMobile": true,
      "IsWeb": false
    };
    this.utilityProvider.presentLoading('Please wait...', '');
    this.schemeDetails.checkAccountStatus(params).subscribe((res1: any) => {

      // res1['AccountStatus'] = true;
      let data = this.multiGrantSelected[0];
      if (res1.AccountStatus === true) {
        let params2 = {
          TokenNumber: this.userToken.EmpID,
          UserName: this.userToken.LoginId,
          DeviceNumber: "web",
          SchemeID: data.SchemeID,
          IsMobile: 0,
          IsWeb: 1
        }
        // this.schemeDetails.getEsopStatusVesting(params2).subscribe((res2: any) => {
        this.utilityProvider.dismissLoading();
        this.utilityProvider.checkStatus = false;

        this.detailsObj = data;


        this.detailsObj['MultiVestedOptionsResult'] = []; //res2['VestedOptionsResult'];
        this.tempAvailableOptions = this.detailsObj.AvailableOptions;
        this.statusSelect = data;

        this.multiSelectedExerciseGen();
        this.stepper.next();
        // })
      } else {
        this.utilityProvider.dismissLoading();
        // this.utilityProvider.presentToast("Your Demat account is not active, kindly check with Trust", 6000, 'top');
        this.utilityProvider.presentToast(res1.message, 6000, 'top')
      }
    })
  }

  multiSelectedExerciseGen() {
    this.multiSelectedExerciseArr = [];
    this.multiGrantSelected.forEach((el, i) => {
      el['OptionsOpted'] = null;
      el['ExerciseAmount'] = null;
      el['PerquisiteValue'] = null;
      el['PerquesiteTax'] = null;
      el['NetProfit'] = null;
      el['Tax'] = null;
      this.multiSelectedExerciseArr.push(el);

      el.BonusOptions.forEach((element, i) => {
        element['OptionsOpted'] = null;
        element['ExerciseAmount'] = null;
        element['PerquisiteValue'] = null;
        element['PerquesiteTax'] = null;
        element['NetProfit'] = null;
        element['Tax'] = null;
        this.multiSelectedExerciseArr.push(element);
      });
      // }
    });
  }

  checkCalculateDisable() {
    let res = false;
    for (let i = 0; i < this.multiSelectedExerciseArr.length; i++) {
      let opt = parseInt(this.multiSelectedExerciseArr[i].OptionsOpted) || 0;
      if (isNaN(opt) || opt < 1) {
        res = true;
        break;
      }
    }
    return res;
  }

  optionsOptedChange(inx) {
    this.calculateDetails = [];
    for (let i = inx; i < this.multiSelectedExerciseArr.length; i++) {
      if (this.multiSelectedExerciseArr[i + 1] && this.multiSelectedExerciseArr[i + 1]['isBonus']) {
        let val = parseInt(this.multiSelectedExerciseArr[inx]['OptionsOpted']) || 0;
        if (parseInt(this.multiSelectedExerciseArr[i + 1]['Exerciseable']) < val) {
          val = this.multiSelectedExerciseArr[i + 1]['Exerciseable'];
        }
        this.multiSelectedExerciseArr[i + 1]['OptionsOpted'] = val;
      } else {
        break;
      }
    }
  }

  resetCalculation() {
    this.calculateDetails = [];
    this.multiSelectedExerciseArr.forEach((el) => {
      el.OptionsOpted = null;
      el.ExerciseAmount = null;
      el.ExerciseAmount = null;
      el.PerquisiteValue = null;
      el.PerquesiteTax = null;
      el.NetProfit = null;
      el.Tax = null;
    })
  }

  ValidateCalculation1() {
    let inx = null;
    if (this.MarketPrice > 0) {   /* Check if market price is available on the exercise date */
      inx = this.multiSelectedExerciseArr.findIndex(x => parseInt(x.OptionsOpted) > parseInt(x.MinimumOptions));
      if (inx < 0) {
        inx = this.multiSelectedExerciseArr.findIndex(x => parseInt(x.OptionsOpted) > parseInt(x.Exerciseable));
        if (inx < 0) {   /* Cannot exercise more than exerciseable options */
          this.calculateMultipleAnalysisDetails(); //All validation proper
        } else {
          this.utilityProvider.presentToast(
            `You do not have enough options to exercise in grant ${this.multiSelectedExerciseArr[inx]['GrantOptionId']}`,
            3000, 'top');
        }
      } else {

      }
    } else {
      this.utilityProvider.presentToast(
        "FMV is not present,Kindly contact Trust to enter price.",
        3000,
        "top"
      );
    }
  }
  ValidateCalculation() {
    let Preclearance = {
      "Remarks": "Preclearance remarks will be displayed here",
      "PreclearanceFlag": true,
      "Status": "P"
    }
    let res = true;
    let msg = '';
    if (this.MarketPrice > 0) {   /* Check if market price is available on the exercise date */
      for (let i = 0; i < this.multiSelectedExerciseArr.length; i++) {
        let OptionsOpted = parseInt(this.multiSelectedExerciseArr[i]['OptionsOpted']);
        let MinimumOptions = parseInt(this.multiSelectedExerciseArr[i]['MinimumOptions']);
        let MaximumOptions = parseInt(this.multiSelectedExerciseArr[i]['MaximumOptions']);
        let Exerciseable = parseInt(this.multiSelectedExerciseArr[i]['Exerciseable']);
        if (OptionsOpted > Exerciseable) {
          res = false;
          msg = `You do not have enough options to exercise in grant ${this.multiSelectedExerciseArr[i]['SchemeName']}`;
          break;
        } else if (OptionsOpted < MinimumOptions && Exerciseable > MinimumOptions) {
          res = false;
          msg = `Minimum options can be exercise is [${this.multiSelectedExerciseArr[i]['MinimumOptions']}] for grant "${this.multiSelectedExerciseArr[i]['SchemeName']}"`;
          break;
        }
        else if (MaximumOptions !== null && OptionsOpted > MaximumOptions) {
          res = false;
          msg = `Maximum options can be exercise is [${this.multiSelectedExerciseArr[i]['MaximumOptions']}] for grant "${this.multiSelectedExerciseArr[i]['SchemeName']}"`;
          break;
        }
      }
      if (res == true) {
        this.calculateMultipleAnalysisDetails();
      } else {
        this.utilityProvider.presentToast(msg, 5000, 'top');
      }
    } else {
      msg = 'FMV is not available.'
      this.utilityProvider.presentToast(msg, 5000, 'top');
    }
  }

  calculateMultipleAnalysisDetails() {
    this.utilityProvider.presentLoading('Please wait...', '');
    let params = [];
    this.multiSelectedExerciseArr.forEach(element => {
      params.push({
        TokenNumber: this.userToken.EmpID,
        UserName: this.userToken.LoginId,
        GrantOptionId: element.GrantOptionId,
        ExercisePrice: element.ExercisePrice,
        NoOfOption: element.OptionsOpted,
        BonusPercent: element.BonusPercent,
        DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web",
        IsMobile: true,
        IsWeb: true,
        MarketPrice: this.MarketPrice
      });
    });

    this.schemeDetails.whatIfAnalysisDetailsNew(params).subscribe((items) => {
      this.calculateDetails = items;

      this.PreClearanceStatus = this.calculateDetails[0].PreClearanceStatus;
      this.ProceedFurther = this.PreClearanceStatus['ProceedFurther'];
      this.EnableLink = this.PreClearanceStatus['EnableLink'];

      this.PerquesiteTax = 0;
      this.calculateDetails.forEach((el) => {
        let inx = this.multiSelectedExerciseArr.findIndex(x => x.GrantOptionId === el.GrantOptionId);
        this.multiSelectedExerciseArr[inx]['ExerciseAmount'] = el.ExerciseAmount;
        this.multiSelectedExerciseArr[inx]['PerquisiteValue'] = el.PerquisiteValue;
        this.multiSelectedExerciseArr[inx]['PerquesiteTax'] = el.PerquesiteTax;
        this.multiSelectedExerciseArr[inx]['NetProfit'] = el.NetProfit;
        this.multiSelectedExerciseArr[inx]['Tax'] = el.Tax;
        this.PerquesiteTax += parseInt(el.PerquesiteTax);
      });
      this.fmvAvl = this.calculateDetails[0].IsCurrentDateAvl;
      if (this.LastWorkingMarketClosing) {
        this.utilityProvider.presentAlert(
          "",
          `Dear User, today's FMV is not generated yet. You may proceed with simulation using available tentative current price ${this.calculateDetails[0].MarketPrice}`
          // "Current FMV is not available. Your perquisite tax is calculated on previous fmv."
        );
      }
      this.backAlert = true;
      this.utilityProvider.dismissLoading();
    });
  }

  confirmDematDetailsNew() {  //confirmDematDetails
    let data = {
      TokenNo: this.userToken.EmpID
    }
    this.utilityProvider.presentLoading('Please wait...', '');
    this.profile.getDematAccount(data).subscribe((res) => {
      this.utilityProvider.dismissLoading();
      let dematAccModal = this.modalCtrl.create("DematAccountDetailsViewPage", res, { cssClass: 'dematAccountDeatilsModal' });
      dematAccModal.present();
      dematAccModal.onDidDismiss((res) => {
        if (!res)
          return false;
        if (res === "c") {
          let action = this.calculateDetails[0].IsCurrentDateAvl ? 'Q' : 'I';
          this.onExerciseSubmit(action);
        } else if (res === "p") {
          this.onExerciseSubmit('S');
          this.navCtrl.push("ProfilePage", { fromExerciseNow: true });
        }
      })
    }, err => {
      this.utilityProvider.dismissLoading();
      this.utilityProvider.presentToast('Please try again later.', 3000, 'top');
    })
  }

  onExerciseSubmit(action) {  // onExercisesave
    let data = {
      IsHDFC: null,
      ExerciseID: this.exerciseId,
      TokenNumber: this.userToken.EmpID,
      ExercisePrice: null,
      PerquisiteTax: this.summation(this.multiSelectedExerciseArr, 'PerquesiteTax'),
      ExerciseAmount: this.summation(this.multiSelectedExerciseArr, 'ExerciseAmount'),
      PerquisiteTaxPercent: this.calculateDetails[0]['Tax'],
      isPerquisiteTaxPaid: null,
      isOfferedPricePaid: null,
      InternetPaymentCharges: null,
      ExercisePaymentMethod: null,
      PerquesitePaymentMethod: null,
      ExerciseDate: moment(),
      Approval: action,
      Remarks: '',
      BonusPercent: null,
      ApplicationFormMode: '',
      Action: '',
      ExerciseOnlinePaymentLog: null, //{},
      onlinePaymentLog: null, //{},
      ExerciseChequePaymentLog: null, //[],
      PerquisiteChequePaymentLog: null, //[],
      UserName: this.userToken.LoginId,
      DeviceNumber: this.utilityProvider.getDeviceDetails().deviceId || "web",
      IsMobile: true,
      IsWeb: true,
      Schemes: []
    }
    this.multiSelectedExerciseArr.forEach(el => {
      let scheme = {
        SchemeId: el.SchemeID,
        ExercisePrice: el.ExercisePrice,
        OptionsOpted: el.OptionsOpted,
        PerquisiteTax: el.PerquesiteTax,
        ExerciseAmount: el.ExerciseAmount,
        ExerciseItemId: el.ExerciseItemId ? el.ExerciseItemId : 0,
        PerquisiteValue: el.PerquisiteValue
      };
      data['Schemes'].push(scheme);
    });
    this.utilityProvider.presentLoading('Please wait...', '');
    this.schemeDetails.submitExercise(data).subscribe(items => {
      this.utilityProvider.dismissLoading();
      this.backAlert = false;
      this.exerciseId = items["ExerciseID"];
      this.ShowDataschemeDetailInfo();
      if (action == "S") {
        this.stepper.selectedIndex = 0;
        this.tabGroup.selectedIndex = 1;
        this.utilityProvider.presentToast(
          "Your Record has been saved successfully..",
          3000,
          "top"
        );
        this.noOfOptionValue = "";
        this.ionViewDidLoad();
        this.resetMultiVar();
      } else if (action == "Q" && !this.LastWorkingMarketClosing) {
        for (let i = 0; i < this.multiSelectedExerciseArr.length; i++) {
          this.multiSelectedExerciseArr[i]['Approval'] = "Q";
          this.multiSelectedExerciseArr[i]['ExerciseNumber'] = items["ExerciseNumber"];
        }
        this.currentExercise['Approval'] = 'Q';
        this.currentExercise['TokenNumber'] = this.userToken.EmpID;
        this.currentExercise['OptionsOpted'] = this.noOfOptionValue;;
        this.currentExercise['OfferedPrice'] = items["OfferedPrice"];
        this.currentExercise['ExerciseNumber'] = items["ExerciseNumber"];
        this.currentExercise['ExerciseAmount'] = this.summation(this.multiSelectedExerciseArr, 'ExerciseAmount');
        this.currentExercise['PerquisiteTax'] = this.PerquesiteTax;
        this.currentExercise['multiSelectedExerciseArr'] = this.multiSelectedExerciseArr;
        this.currentExercise['ExerciseRequestID'] = this.exerciseId;
        this.currentExercise['EmpID'] = this.userToken.EmpID;
        this.currentExercise['ExerciseDate'] = this.multiSelectedExerciseArr[0]['ExerciseDate'];
        this.getPDFDataToThirdTab();
      } else {
        this.ionViewDidLoad();
        this.resetMultiVar();
        this.utilityProvider.presentToast(
          "This request has been calculated on previous FMV. You will have to recalculate when the FMV is available.",
          10000,
          "top"
        );
        this.stepper.selectedIndex = 0;
        this.tabGroup.selectedIndex = 1;
      }
    }, error => {
      this.utilityProvider.dismissLoading();
      this.errorMessage = <any>error;
    });
  }

  onEditGetExerciseNew(data) {
    this.exerciseId = data["ID"];
    let params =
    {
      "TokenNumber": this.userToken.EmpID,
      "UserName": this.userToken.LoginId,
      "DeviceNumber": "web",
      "IsMobile": true,
      "IsWeb": false
    };
    this.schemeDetails.checkAccountStatus(params).subscribe((res1: any) => {

      if (res1.AccountStatus === true) {
        this.currentExercise = data;
        this.summarySaveSelectedGen(data);
        this.stepper.next();
      } else {
        this.utilityProvider.presentToast(res1.message, 6000, 'top')
      }
    });
  }

  summarySaveSelectedGen(data) {
    this.multiSelectedExerciseArr = [];
    data['schemeItems'].forEach(element => {
      // let grantData = this.getValueFromMaster(element.SchemeId);
      let grantData = this.grantDataFromMaster(element.SchemeId);
      let indata = {
        "Approval": data.Approval,
        "ExerciseNumber": data.ExerciseNumber,
        "ExerciseDate": data.ExerciseDate,
        "Tax": data.PerquisiteTaxPercent,
        "ExerciseItemId": element.ExerciseItemId,
        "GrantOptionId": element.GrantOptionId,
        "SchemeCode": element.SchemeCode,
        "SchemeId": element.SchemeId,
        "SchemeName": element.SchemeName,
        "MinimumOptions": grantData['MinimumOptions'],
        "ExercisePrice": grantData['ExercisePrice'],
        "OptionsGranted": grantData['OptionsGranted'],
        "UnvestedOptions": grantData['UnvestedOptions'],
        "Exerciseable": grantData['Exerciseable'],
        "isBonus": grantData['isBonus'],
        "OptionsOpted": element.OptionsOpted,
        "ExerciseAmount": element.ExerciseAmount,
        "PerquisiteValue": element.PerquisiteValue,
        "PerquesiteTax": element.PerquesiteTax,
        "NetProfit": element.NetProfit,
        "BonusPercent": grantData['BonusPercent'],
      }
      this.multiSelectedExerciseArr.push(indata);
    });
    // this.ValidateCalculation();
  }

  grantDataFromMaster(schemeId) {
    for (let el of this.finalArrayNew) {
      if (el.SchemeID == schemeId) {
        return el;
      } else {
        for (let elBonus of el.BonusOptions) {
          if (elBonus.SchemeID == schemeId) {
            return elBonus;
          }
        }
      }
    }
  }

  getValueFromMaster(schemeId) {  //buggy
    let found = false;
    let data = null;
    loop1: {
      for (let i = 0; i < this.finalArrayNew.length; i++) {
        if (this.finalArrayNew[i].SchemeID == schemeId) {
          data = this.finalArrayNew[i];
          break loop1;
        }
        /*loop2: */
        for (let j = 0; j < this.finalArrayNew[i]['BonusOptions'].length; j++) {
          data = this.finalArrayNew[i];
          break loop1;
        }
      }
    }
    return data;
  }

  viewDocumentsInSummary(status) {
    let validStatus = ['P', 'E', 'T', 'O', 'R', 'A', 'U', 'L', 'J', 'K'];
    return validStatus.findIndex(x => x == status) > -1 ? true : false;
  }

  getClosureWindow() {
    let params = {
      'TokenNo': this.userToken.EmpID
    }
    this.esopStatusProvider.getClosureWindow(params).subscribe((res: any) => {
      if (res.length > 0) {
        this.closureWindow = res[0]['windowClosure'];
        this.isOnHold = res[0]['isOnHold'];
        this.closureWindowStatus = res[0]['statusdesc'];
      }

    })
  }

  moveConfirmStepper(i: number) {
    this.paymentGatewayTab = false;
    this.stepper1.selectedIndex = i;
  }

  backToSummary() {
    let confirm = this.alertCtrl.create({
      title: 'Warning!',
      message: 'Are you sure want to go back?',
      cssClass: "customCommonAlert",
      buttons: [

        {
          text: "No",
          handler: () => { }
        },
        {
          text: "Yes",
          handler: () => {
            this.stepper.selectedIndex = 0;
            this.tabGroup.selectedIndex = 1;
            this.ionViewDidLoad();
          }
        }
      ]
    });
    confirm.present();
  }

  applyPreclearance() {
    let data = {
      'TokenNo': this.userToken.EmpID,
    }
    let modal = this.modalCtrl.create("ApplyPreclearanceModalPage", data);
    modal.present();

    modal.onDidDismiss(data => {
      this.getClosureWindow();
    });
  }

  closureOrHoldText() {
    if (this.isOnHold) {
      return this.isOnHoldText;
    } else if (this.closureWindow) {
      return this.closureWindowText;
    } else {
      return '';
    }
  }
  closureOrHoldFlag() {
    return this.isOnHold || this.closureWindow;
  }

  isDocAvail(val) {
    if (!val || val.FileName === null) {
      return true;
    }

  }

  getImagePreview(i) {
    if (this.uploadedForms[i]['fileTypeError'] == false) {
      if (this.uploadedForms[i]['ext'] == 'pdf') {
        return '/assets/img/files/pdflogo.png';
      } else {
        return this.uploadedForms[i]['fileData'];
      }
    } else {
      return '/assets/img/files/cloudupload.png';
    }
  }

  ApplyForPreclearanceDetailsNew() {
    this.navCtrl.push("PreclearanceNewPage", { preclearappliedfor: "exceed2.5cr", appliedfor: "self", precleranceDisable: true })
  }

  openPaymentGateway(event: any) {
    console.log(event.target.checked);
    this.paymentGatewayTab = !this.paymentGatewayTab;
  }

  goPaymentStep(event: any) {
    this.stepper1.selectedIndex = 1
  }


}
