import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IonicPage, NavController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { HomePage } from '../home/home';

import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
	loginForm: FormGroup;
	loginError: string;
	pageCtrl: string;
	forgotPasswordForm: FormGroup;
	signUpForm: FormGroup;
	signUpError: string;

	constructor(
		private navCtrl: NavController,
		private auth: AuthentificationProvider,
		private db: DataHandlingProvider,
    	fb: FormBuilder,
    	public translate: TranslateService
	) {
		this.pageCtrl = '';
		this.loginForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
		this.forgotPasswordForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])]
		});
		this.signUpForm = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
  	}
  
  	login() {
		let data = this.loginForm.value;

		if (!data.email) {
			return;
		}

		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signInWithEmail(credentials)
			.then(
				() => this.navCtrl.setRoot(HomePage),
				error => this.loginError = error.message
			);
  	} 

  	goToSignUp(){
		this.pageCtrl = 'signUp';
	}

	signUp() {
		let data = this.signUpForm.value;
		let credentials = {
			email: data.email,
			password: data.password
		};
		this.auth.signUp(credentials).then(user =>  {console.log('done');this.db.createUser(user.user.uid, user.user.email)}).then(
			() => this.pageCtrl = '',
			error => this.signUpError = error.message
		);
  	}
	
	goToForgotPassword() {
		this.pageCtrl = 'forgotPassword';
	}

	resetPassword() {
		let email = this.forgotPasswordForm.value.email;

		if (!email) {
			return;
		}

		this.auth.sendPasswordResetEmail(email)
			.then(
				() => this.navCtrl.setRoot(LoginPage)
				);
	}
}
