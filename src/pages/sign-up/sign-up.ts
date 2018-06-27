import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { HomePage } from '../home/home';

import { AuthentificationProvider } from '../../providers/authentification/authentification';
import { DataHandlingProvider } from '../../providers/data-handling/data-handling';

@Component({
	selector: 'as-page-sign-up',
	templateUrl: './sign-up.html'
})
export class SignupPage {
	signupError: string;
	form: FormGroup;

	constructor(
		private fb: FormBuilder,
    	private navCtrl: NavController,
		private auth: AuthentificationProvider,
		private db: DataHandlingProvider
	) {
		this.form = fb.group({
			email: ['', Validators.compose([Validators.required, Validators.email])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
		});
  }

  signup() {
		let data = this.form.value;
		let credentials = {
			email: data.email,
			password: data.password
		};
		//this.auth.signUp(credentials).then(user => {this.newUser.userid = user.user.uid}).then( () => this.db.createUser(this.newUser)).then(
		this.auth.signUp(credentials).then(user =>  {this.db.createUser(user.user.uid, user.user.email)}).then(
			() => this.navCtrl.setRoot(HomePage),
			error => this.signupError = error.message
		);
  }
}
