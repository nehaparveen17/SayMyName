import { Component } from '@angular/core';
import { BehaviorSubject, Observable, Subject, interval, take } from "rxjs";
declare var $: any;
import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MatDialog } from '@angular/material/dialog';
import { DialogModuleComponent } from '../dialog-module/dialog-module.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent {
  title = 'micRecorder';
  //Lets declare Record OBJ
  public record: any;
  //URL of Blob
  public url: any;
  public error: any;
  public serverData: JSON | undefined;
  public employeeData: JSON | undefined;
  public mock: any | undefined;
  public studentDetails: any | undefined;
  public username: any | undefined;
  public studentID: any;
  public start_recording: boolean = false;
  public hide_default_recording_icon: boolean = true;
  public obs$ = interval(1000);
  public time_interval: number = 0;
  public limited$ = this.obs$.pipe(take(11));
  public disable_re_record: boolean = true;
  public display_content_card: boolean = false;
  public name_in_phonetics: string | undefined;
  public phoneticName: string | undefined;
  public soundsCorrectFlag: boolean = false;
  public displayGreatCapturedFlag: boolean = false;
  public tempMsg: boolean = false;
  public soundsWrongFlag: boolean = false;
  public edited_phonetics: string = '';


  // second phase of the project
  public listOfPronouns = [
    { value: '01', viewValue: 'She / Her' },
    { value: '02', viewValue: 'He / Him' },
    { value: '03', viewValue: 'They / Them' },
    { value: '04', viewValue: 'Prefer Not to Say' },
  ];

  public listOfIntake = [
    { value: '01', viewValue: 'Fall' },
    { value: '02', viewValue: 'January' },
    { value: '03', viewValue: 'May' },];
  public student_ID: string = '';
  public student_Name: string = '';
  public student_pronoun: string = '';
  public student_intake: string = '';
  public confirmed_Phonetics: string = ''
  public listOfPhonetics: any;
  public display_edit_search_bar: boolean = false;
  public show_functional_buttons: boolean = false;
  public feedbackFlag: boolean = false;
  public newNameFlag: boolean = false;
  public first_name: string = ''
  public last_name: string = ''
  public votes: number = 0
  public audion_binary_file_path: string = ''
  public final_phonetics: string = ''
  public edit_button_flag: boolean = false
  public dislike_button_flag: boolean = false
  public like_button_flag: boolean = false
  public show_save_button: boolean = false;
  public show_edit_button: boolean = false;
  public value: string = ''
  public save_button_flag: boolean = false;
  public display_content_card_for_view_only: boolean = false
  public phonetics_selection: string = ''

  constructor(private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private ngxService: NgxUiLoaderService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    // var fs = require('file-system');
    // fs.writeFile('mock.wav', "\xfff344c4000000034801400000ff2cc01001f81c4853fa18110ac680a567fcaa28e9c6784ee603f637c6e7bc687985ff99a1066ff4f49f55fedbf2a7455df977acd08143bf9ccfbde5121c0a867ffcff1c2d0a044d140200e607004020342a10fff344c45312416240019a38001804a71d486819b2139894100042932d0ca30586b30b86e0003a0613cc3e208c7c09103d240280104008ffbf11f86a0173df870ac4024bfd420368d36d9dbd49a0da0d0a8d021cd040d21762b5177972886001fff344c45d1d40ba4801dd4800338e04454e3a71ff56c6a97b9146a7699aa44e6317729c110b80f0fa7f0840130511839b80730980b2e017d0c2703ce053240439a0e246a4219ac48392d31211c6a4f74d5cf4f46d3edd451b9ef6a02019d619fff344c43b1528ee5c00eec670cae69f03de5c5995205361dffea5b16428d5edffffebdfdddd4a1e0033953210024c26f4380b8c1828060d509409049ed30866a0c02402d81b7317180c8a0b6fe36bad300c140427ab6de10a0ebd31d8fd3c5ffff344c4391798c26400e71e4cc0d3c43ecc1176d5af4c526485c9bc58fbd3264393018f47d9b4a1a6b62ddb47fe8fffd75d55a27123edd02a1d3859d878203a0043625041a1e28792500302695d0280541b0971ccc51558c36cead00859aa59fff344c42d1dc9827800e64c947ad2fcc238da700522d92e9b2e6b2c9e594569c89ccf55ea526bf91113e40c07b1c8342a1eef7f7d3d32a6f7e6ffbf4fbbdded1278321e2e5c793140420f839ffffff3f1b5131210adf52ab3cddc68a6490a17fff344c408134122ac00d3d870c6aac02d10e8251729add76ab64aedb4b8a5a3bd6127c659ba74b6288520a10ca6d2c2f9d034262ca3ec44bed34a5266cb1ce9b6d29d39abdfc131c67eb0b940b026afeb15efffd6250434aeb6355a218580b5fff344c40e14319ab400d35694e29d6443643c1a69312ef52d8df5d69baa6248928da224a070f9cb50f87b279fdc8a473872aa1cf4975d8c739550d197cc57fdff1753e7a440870e31a36a7fffffffaad7eb730ef137287f0a94a211046c9cdefff344c4101679a6ac00d35694501ac06d00621eb395148d15a8d8d3a8c917d6625c37ad89934779f583e86a37227f4513ad7cb5a75d32d353562b74e37272c7ffa8aebae6f737988480a5a87bd6c1dfffffdeefa9092597ef2c699fc3dce068fff344c4091271c29c00d36094646e95f01c166e1eac3d659245213e0136404f91478f730316f48dbc997648e93018a8aea45162f0e25be95bea5f4cc51e951f491fdbff59c3666cee25fdffffa18a37d36f522e88cb462b92982800c7e79dd3fff344c4121681528000e5169402800c2ca20314a22910123831b8075e741cd0dc872b52850834bce96bac9b13f1b279911c8563e60ac088fb2382b5bfd046b862036c5caf483591d96d5cee7733afffffffcd4c134f997421e740c30c493380fff344c40b14c94e7c00ec909446e0e1cc30045045e6380399261ad25f9447240f98115174c9158d7223e5c323675d44551d66031ab5a3907e6a2780a88a8d79f75fb57c630eb72e06935fff89aef63fffffffef0eaa5a94b2a7b104662d9285fff344c40a0fc13e8400e60a714948b365f22fb9844b62b477e51f48aae2468d54c31afccf786185fe7d667e70a033a9cc2a666464151421ceae7eabd10eb4288b1b74ea76e2084f1f0215ec96bc6a6a9130ec3147975f50987ce61d531a55f3fff344c41e18e3229800c1cabcfb2d3987d5115d974bbb32a597d29ffffef7ffe4eb5fc9e7767a351addfd4e846908c42594e79db54640e0a18842098ba0700017387c3e070f87c5dd4c200000039c0404106a367ca0060b134aaad3ff17e79efff344c40d14db22a800404ebc2f2fe111827341ffdffe8affffffd374b7376eff57baad7a66231bab3ba9ce6942ecc618609c78c1c6223635ce20167624ea3e4dcc30491f1a80c0846860bc68407480986838d51bfe898fbecb9ccdffff207ffff344c40c12a31eac00084ebdd97fffacccd7fff5dfff5ff33ed56eac7d8e9ec7b2decf5ce731d98d1f61e89670a0bb963107ce34b1f414113017898307961b03f85432e258980708c49545117f3737ffddebfffafcbffffdb46bfffefb7fd1fff344c414129b1aac00084ebd954cefa3a576d0c61c3aeee8947fa188e56cc9a0e0903c24338ddcd38b0e9e383af711104b140f0d822118e050543420510b0c8d86802a35fffffffffffffffffe642fffffffdde8bd1fd5915b45ea86a31d36fff344c41c11fb1ab000084ebdc752751cc741b1261e544257150a5890e0dc8161d72048b8d4a288a38251c382e222a19405c1334212250aad0cc9ddfffffffffffffffffffffffff5a6552b19f95fe67ca43296a57645636c5672b250d5290cfff344c42712131e80014a2800652ab80a28010b8a98a6121e1d10162a090b22888aa0d1530d0f19481e1e1d2091551b762c82748c913cb9df8bbf997f7dfc9caeac0fc07896b6b68000030580bd37ed501e258000040b1e8ed6bd980780386cfff344c4311e1b2a60019838001600c213a8dff07e03c4b00801812005aeccfb26b7e0fc4b0180f06800603c27008ed7edfd26df018241e0fdc684080f9f1c67d1f4dff699b2d1af90306eea341a1a4ca931a0e18a8605cd160387165c943e13fff344c40b1442c2b0018c10011c98569e73210ca55c8dd9be965c198a5dd6e84233a952edf9cc4e8194b6b8137a12c7b842080a4523196bd009f6516d88dbb25828594ac6a97752d3fe77ff902b9d554879facf3bc5e3084596b31264c042a4fff344c40d11c936a001d9400030c0c745c87ec45d379f54ee45dd5498fc3740c8286c222d65b5a49480d0460681307931093d4c254c77fbf1532e49e800a5967df860b6eff5c9d58e7df04365730c2c6a93b2902a05a27f318471a725ddd781fff344c41813c93ea400c3de702cdf6e3acbed7819d663db72bec59b2b3432821cd2418ba876b78df3bceaf6c5b5bf9dd214366cc3b123694fbd4f14884518a1d7a7facdaaa7e6c1289eba2318d16aa461c12b36e3d619366b39223c5646c405fff344c41b11713aa400c3d0700eb4bee3481be8bf313059a8381483a406c454529a63e6bf9989fa66a6bc70f36e5d247e88a057c4dfedaeceeba07506ea3c604ad83be654b1aff49d00368e15879468c5d101a87da0e3f96d13844f27e5f26cfff344c42811413a9400ccd4705a6220c02d2987e5797dfbefa65598e1f21fedfcea2d995d1fffffffea70716047848a5dc68c94c41e6a4059c8b4f209603f0c587ea9b8cf03997dc945c869f5b934cb6aa0f61a1c6280a2d0901990c7956824fff344c43612813a8400d44a7028b7a7bd5ea4551c642fffc91966d4ffffffffeb56ca04dd38e725155c861f1402802fd01458de46d6194a0f121fa52c6be83927edc94cd19bedae6cd9de65ac847b89932cc862a9891f322e3c3d1159ae2b88fff344c43f1281427400dbd070887e0f25c97f57f5dfd4024b587d851cbdf4ed740428a64aed1191336e9adb8458346b1dc1d2b94ac684f70b3f952efead9d513bc14c3861e91bd1296d73142c811ffd22ffed30b503223ffcf712b6aa110452fff344c4481121427800d606708250a16c4c19729a5ca7000b665780faa9e2de236b1d826666c08ebaae2dfc6f8afc134db0e0c0768599a9d7ee569a0e7cffee6a560607ce37ff57bba22feb2d0a001c61da402731ad28c91da202a33409809dfff344c4560ff13a7800d3c67005b35c0679a00a61951959bc5ef9c6a36fef77f80b669b87ceeadeda6f636e1adbfedf59f3ff485903c6d5ff2a6b5d6c55314261032e00d2d2181478fab27ad7b1834634a1e305d969d12a67af98d74fab2fb6fff344c46911a9367400dbcc70fdeb8df528130c254100850a72ccf5dc99c4b017dcf287f94e8904457ffd2fe9bd2a0315c1e98477660340caa6640625b14f9404158424106095858e9d150fd843348face5690c1b7dcdb6410da12020027ba7fff344c47510d93a7000d3c670eb3c6d38b184a267ffffdff3eff2ec61dffeb706379b06907466a3990e0e29088efa16d0302a6cb994d8fd6139b3804a284f533d5cf9cb4e2eb6a6ca8a8e0e81b00b0361ed75faf36b4c341a9b0db5fff2d345fff344c48411c1426400db0c701d2123c223dff628efdac96a16d3a15af14af8ef595b7050509735122c89568da77ef61d53960a3031e4921e232a49e050a879f1e2ca7953022c4af09b54d2d5875d520f129b96ed4b5aa788932affc8f5aef4fff344c49012213a5800c31070d16c2518e75c25a51b3b137ae4526c4e8e6a5b9a508dfccc632e074374236d05167832493ce43fac52b81e0018182295de106a189172879c9eff64ca9752b7776cc6fe85256c40260b693284e1c403a00ad0b2fff344c49a1278a6040079864c8a3e08b2b465d72320c051b1c5838683c3838387126ce9950b8a8446808a8a8322b02953c78594f12c164b6592eee9d5ee47bf60cffea50987b261b9a9f0a42c0a81e281f324c84e34080935246956662bd22cfff344c4a31020ba00007a464c481916160f0142824346857c5d8970b113231ad33ffa46319322ffd629c5458d2a4c414d45332e313030aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa4c414d45332efff344c4b511608df80049864c313030aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa4c414d45332efff344c4c20f0865b800624c28313030aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa4c414d45332efff344c4ac0000034800000000313030aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa4c414d45332efff344c4ac0000034800000000313030aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa4c414d45332efff344c4ac0000034800000000313030aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafff344c4ac0000034800000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafff344c4ac0000034800000000aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", function(err: any) {})
  }


  openDialog(): void {
    let dialogRef = this.dialog.open(DialogModuleComponent, {
      width: '30%',
      data: { studentId: this.student_ID, preferredName: this.student_Name, Phonetics: this.final_phonetics }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.feedbackFlag = true;
    });
  }

  sendTheNewValue(event: any) {
    this.value = event.target.value;
    if (this.value !== '' || this.value !== undefined || this.value !== null) {
      this.show_save_button = true
    }
    if (this.value == '' || this.value == undefined || this.value == null) {
      this.show_save_button = false
    }
  }



  // this method handles the user action from the user interface
  public handleUserAction = (type: string, event: any) => {
    switch (type) {
      case 'search': {
        this.display_content_card = false;
        this.display_content_card_for_view_only = false;
        if ((this.student_ID !== '' || this.student_ID !== null || this.student_ID !== undefined) && (/^\d+$/.test(this.student_ID)) && this.student_ID?.length == 9 && this.student_pronoun == '' && this.student_Name == '' && this.first_name == '' && this.last_name == ''){

this.viewDetails()
        }
        else {
          if (this.student_ID == '' || this.student_ID == null || this.student_ID == undefined) {
            this.displayMessage('Please enter the Student ID', 'ERROR')
          }
          else {
            if (/^\d+$/.test(this.student_ID)) {
              if (this.student_ID?.length == 9) {
                console.log(this.student_Name)
  
                if (/[a-zA-Z ]+/.test(this.student_Name)) {
                  if (/[a-zA-Z ]+/.test(this.first_name)) {
                    if (/[a-zA-Z ]+/.test(this.last_name)) {
                      let pronoun = ''
                      this.listOfPronouns.forEach((ele: any) => {
                        if (ele?.value === this.student_pronoun) {
                          pronoun = ele?.viewValue
                        }
                      })
  
                      let reqObj = {
                        "first_name": this.first_name,
                        "last_name": this.last_name,
                        "student_id": parseInt(this.student_ID),
                        "pronoun": pronoun,
                        "intake": "Fall",
                        "course": "AIGS",
                        "year": 2023,
                        "preferred_name": this.student_Name
                      }
                      this.getPhonetics(reqObj)
  
                      if (this.confirmed_Phonetics == '' || this.confirmed_Phonetics == undefined || this.confirmed_Phonetics == null) {
                        this.show_functional_buttons = false;
                      }
                    }
                    else {
                      this.displayMessage('Last Name can only contain lower and uppercase alphabets including space.', 'ERROR')
                    }
                  }
                  else {
                    this.displayMessage('First Name can only contain lower and uppercase alphabets including space.', 'ERROR')
                  }
  
                }
                else {
                  this.displayMessage('Preferred Name can only contain lower and uppercase alphabets including space.', 'ERROR')
                }
  
              }
              else {
                this.displayMessage('Student ID should be of 9 digits', 'ERROR')
              }
            }
            else {
              this.displayMessage('Student ID should be in number only', 'ERROR')
            }
          }
        }




      
        
        break;
      }
      case 'phonetics-correct': {

        let reqObj = {
          student_id: parseInt(this.student_ID),
          userfeedback: 'Yes'

        }
        this.dislike_button_flag = true
        this.giveUserFeedback(reqObj)
        break;
      }
      case 'phonetics-wrong': {

        let reqObj = {
          student_id: parseInt(this.student_ID),
          userfeedback: 'No'
        }
        this.like_button_flag = true
        this.giveUserFeedback(reqObj)
        break;
      }
      case 'edit': {
        this.display_edit_search_bar = true;
        this.feedbackFlag = false;
        this.edited_phonetics = this.confirmed_Phonetics;
        if (this.value !== '') {
          this.show_save_button = true
        }
        break;
      }
      case 'phoneticsChanged': {
        this.edited_phonetics = event.value;
        // this.show_functional_buttons = true;
        this.show_save_button = true
        break;
      }
      case 'save': {
        let reqObj = {}
        if (this.edited_phonetics == '') {
          reqObj = {
            student_id: parseInt(this.student_ID),
            name: [this.student_Name],
            phonetics_selection: [this.confirmed_Phonetics],
            // votes: this.votes,
            show: true,
            data_in_votes_table: false,
            audio_selection: this.audion_binary_file_path
          }
        }
        else {
          reqObj = {
            student_id: parseInt(this.student_ID),
            name: [this.student_Name],
            phonetics_selection: [this.edited_phonetics],
            // votes: this.votes,
            show: true,
            data_in_votes_table: false,
            audio_selection: this.audion_binary_file_path
          }
        }

        this.like_button_flag = false
        this.dislike_button_flag = false
        this.savePhonetics(reqObj)
        break;
      }
      default: {
        break;
      }
    }
  }

  // global function to show toaster message
  private displayMessage = (message: string, state: string) => {
    switch (state.toLowerCase()) {
      case 'error':
        this.toastr.error(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      case 'info':
        this.toastr.info(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      case 'success':
        this.toastr.success(message, state, {
          closeButton: true,
          progressBar: true
        });
        break;
      default:
        break;
    }

  }



  // calling the service from the backend to get the required phonetics.
  private getPhonetics = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/createpost', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.display_content_card = true;
        this.votes = requestedData?.data?.votes
        let p1 = requestedData?.data?.phonetics
        let p2: any[] = []
        requestedData?.results.forEach((el: any) => {
          p2.push(el?.phonetic)
        })
        this.student_Name = requestedData?.data?.preferred_name
        let pronoun = requestedData?.data?.pronoun
        this.listOfPronouns.forEach((ele: any) => {
          if (ele?.viewValue === pronoun) {
            this.student_pronoun = ele?.value
          }
        })
        this.first_name = requestedData?.data?.first_name
        this.last_name = requestedData?.data?.last_name
        this.student_ID = requestedData?.data?.student_id
        this.audion_binary_file_path = requestedData?.data?.audio_binary
        if (p2?.length !== 0 || p2?.length !== undefined || p2?.length !== null) {
          this.listOfPhonetics = p1.concat(p2)
        }
        else {
          this.listOfPhonetics = p1
        }
        this.show_edit_button = true;
        // this.show_functional_buttons = true
        this.displayMessage('Successful API response.', 'SUCCESS')
      }
      else {
        this.displayMessage(requestedData?.message, 'ERROR')
        this.ngxService.stop();
      }
    })
  }

  private giveUserFeedback = (reqObj: any) => {
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/userfeedback', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.ngxService.stop();
        this.tempMsg = true;
        this.displayMessage('Feedback Captured', 'SUCCESS')
        this.like_button_flag = true
        this.dislike_button_flag = true
      }
      else {
        this.displayMessage(requestedData?.message, 'ERROR')
        this.ngxService.stop();
      }
    })

  }

  private savePhonetics = (reqObj: any) => {
    this.final_phonetics = reqObj?.phonetics_selection
    this.ngxService.start();
    this.httpClient.post('http://127.0.0.1:8081/selection', reqObj).subscribe(data => {
      let requestedData: any = data
      if (requestedData?.status === "success") {
        this.edit_button_flag = true;
        this.ngxService.stop();
        this.displayMessage('Phonetics Saved Successfully', 'SUCCESS')
        this.openDialog()
        // this.feedbackFlag = true;
        this.save_button_flag = true;
      }
      else {
        this.displayMessage('Could not process the request', 'ERROR')
        this.ngxService.stop();
      }
    })
  }


  private viewDetails = () => {
    this.ngxService.start();
    this.httpClient.get('http://127.0.0.1:8081/getRecords/?studentID='+ parseInt(this.student_ID)).subscribe((data: any)=> {
      // if (data?.status === "success") {
        this.listOfPronouns.forEach((ele: any) => {
          let pronoun = data?.results[0]?.pronoun
          if (ele?.viewValue === pronoun) {
            this.student_pronoun = ele?.value
          }
        })
        this.first_name = data?.results[0]?.first_name
        this.last_name = data?.results[0]?.last_name
        this.student_Name = data?.results[0]?.preferred_name
        this.phonetics_selection = data?.results[0]?.phonetics_selection
        this.ngxService.stop();
        this.displayMessage('Successfully retrieved details.', 'SUCCESS')
        this.display_content_card_for_view_only = true;
      // }
      // else {
      //   this.displayMessage('Could not process the request', 'ERROR')
      //   this.ngxService.stop();
      // }
    })
  }

}
