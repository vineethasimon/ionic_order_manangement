import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { BarcodeScanner} from 'ionic-native';
import { Camera } from 'ionic-native';
import { Http } from '@angular/http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  srcImage: string
  constructor(public navCtrl: NavController, public http: Http, public alertCtrl: AlertController) { }

  clickForBarcode() {
    BarcodeScanner.scan()
      .then((result) => {
        alert(
          "We got a barcode\n" +
          "Result: " + result.text + "\n" +
          "Format: " + result.format + "\n" +
          "Cancelled: " + result.cancelled
        )
      })
      .catch((error) => {
        alert(error);
      })
  }
  clickForOCR() {
    this.srcImage = '../../assets/imgs/demo.png'
    Camera.getPicture({
      quality: 100,
      destinationType: 0, // DATA_URL
      sourceType: 1,
      allowEdit: true,
      saveToPhotoAlbum: false,
      correctOrientation: true,
      encodingType: Camera.EncodingType.PNG,
      mediaType: Camera.MediaType.PICTURE
    }).then((imageData) => {
      /*console.log(imageData);
      this.srcImage = `data:image/png;base64,${imageData}`;
      setTimeout(() => {
        (<any>window).OCRAD(document.getElementById('image'), text => {
          alert(text);
        });
      }, 1000);*/

      const body = {
        "requests": [
          {
            "image": {
              "content": imageData
            },
            "features": [
              {
                "type": "TEXT_DETECTION"
              }
            ]
          }
        ]
      }
      this.http.post("https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDhgGBPTkt3fIKXPs5QeZWwcXtJ-RuDStE",body)
      .subscribe(data=>{
        console.log(data.json().response);
        let alert = this.alertCtrl.create({
          title: 'Scanned Data',
          message: 'Please confirm scanned data',
          inputs: [
            {
              name: 'title',
              placeholder: 'Title',
              value:data.json().responses["0"].fullTextAnnotation.text.replace(/\r?\n|\r/g,"")
            },
          ],
          buttons: [
            {
              text: 'Cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            },
            {
              text: 'Save',
              handler: (value) => {
                console.log('Saved clicked'+value.title);
              }
            }
          ]
        });
    
        alert.present();
      });
    }, (err) => {
      console.log(`ERROR -> ${JSON.stringify(err)}`);
    });
  }
}