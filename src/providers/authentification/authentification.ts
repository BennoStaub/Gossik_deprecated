import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AuthentificationProvider {
	private user: firebase.User;

	constructor(
		public afAuth: AngularFireAuth
	) {
		afAuth.authState.subscribe(user => {
			this.user = user;
		});
	}

	signInWithEmail(credentials) {
		console.log('Sign in with email');
		return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
			 credentials.password);
	}

	signUp(credentials) {
		return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
	}

	signOut(): Promise<void> {
		console.log('Sign out');
		return this.afAuth.auth.signOut();
	  }


	get checkLoggedIn() {
		return this.user !== null;
	}

}
