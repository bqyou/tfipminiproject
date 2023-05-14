import { Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {take} from 'rxjs/operators';
import { Router } from '@angular/router';
import { TextService } from '../service/text.service';
import { Messages, TextMatch } from '../models/models';
import { AuthenticationService } from '../service/authentication.service';
import { Subscription, interval } from 'rxjs';


@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit, OnDestroy{

  constructor(private _ngZone: NgZone, private router: Router,
      private textService: TextService, private authenticationService: AuthenticationService) {}

  @ViewChild('autosize')
  autosize!: CdkTextareaAutosize;

  textMatch!: TextMatch

  messages!: Messages[]

  virginChat: boolean = true

  fontSize='14px'

  private subscription!: Subscription

  triggerResize() {
    // Wait for changes to be applied, then trigger textarea resize.
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  async handleKeyPress(event: KeyboardEvent): Promise<void> {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent the default behavior of the Enter key (e.g., new line)
      const typedMessage = (event.target as HTMLTextAreaElement).value.trim();
      
      if (typedMessage.length === 0) {
        (event.target as HTMLTextAreaElement).value = ''; // Clear the textarea if the message is blank
      } else {
        const msg: Messages = {
          senderId: 0,
          receiverId: this.textMatch.id,
          message: typedMessage
        };  
        this.messages = await this.textService.sendMessage(msg);
        (event.target as HTMLTextAreaElement).value = ''; // Clear the textarea after logging the message
      }
    }
  }

  async ngOnInit(): Promise<void> {
      this.textMatch = this.textService.getTargetUserToText()
      const targetId = this.textMatch.id
      this.messages = await this.textService.getChatHistory(targetId)
      if (this.messages.length>0){
        this.virginChat=false
      }
      this.subscription = interval(1000).subscribe(()=>{
        this.updateChat()
      })
  }

  async updateChat(){
    this.messages = await this.textService.getChatHistory(this.textMatch.id)
    if (this.messages.length>0){
      this.virginChat=false
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goHome(){
    this.router.navigate(['/homepage'])
  }

}
