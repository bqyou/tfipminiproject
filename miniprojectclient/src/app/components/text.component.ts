import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { TextMatch, Messages } from '../models/models';
import { TextService } from '../services/text.service';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit, OnDestroy, AfterViewChecked{

  constructor(
    private router: Router,
    private textService: TextService,
    private title: Title 
    ) {}

  @ViewChild('chatSection')
  chatSectionRef!: ElementRef;


textMatch!: TextMatch | null

messages!: Messages[]

private subscription!: Subscription

isLoading = true

ngOnInit(){
  this.title.setTitle('FiiNDER - Chat')
  this.textMatch = this.textService.getTargetUserToText()
  this.getChatHistory()
  this.scrollToBottom()
  this.subscription = interval(1000).subscribe(()=>{
    this.updateChat()
  })
  setTimeout(() => {
    this.isLoading = false;
  }, 1000);
}

ngAfterViewChecked(): void {
  
    this.scrollToBottom()
  
}

async getChatHistory(){
  if (this.textMatch){
  const targetId = this.textMatch.id
  this.messages = await this.textService.getChatHistory(targetId)
  }
}

async handleKeyPress(event: KeyboardEvent): Promise<void> {
  if(this.textMatch){
    if (event.key === 'Enter'){
      event.preventDefault()
      if (event.shiftKey){
        (event.target as HTMLTextAreaElement).value += '\n'
      } else {
        const typedMessage = (event.target as HTMLTextAreaElement).value.trim()
        if (typedMessage.length===0){
          (event.target as HTMLTextAreaElement).value = ''
        } else {
          const msg: Messages = {
            senderId: 0,
            receiverId: this.textMatch.id,
            message: typedMessage
          };
          this.messages.push(msg);
          (event.target as HTMLTextAreaElement).value = ''
          this.textService.sendMessage(msg);
        }
      }
    }
  }
}

formatMessage(message: string): string {
  return message.replace(/\n/g, '<br>');
}

scrollToBottom(): void {
  const element: HTMLElement | null = this.chatSectionRef?.nativeElement;
  if (element) {
    
    element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
    
  }
}

async updateChat(){
  if (this.textMatch){
    const newMessages = await this.textService.getChatHistory(this.textMatch.id)
    if (newMessages.length > this.messages.length) {
      this.messages = newMessages;
    }
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

logout(){
  const confirmation = confirm('Do you want to log out?')
    if (confirmation){
      localStorage.removeItem('token')
      this.router.navigate(['/login'])
    }    
}

}
