import React from 'react';
import { Route, Link, Router, Switch, Routes } from 'react-router-dom';
import logoPath from '../images/logo.svg';

// В корневом компоненте App описаны обработчики: onRegister, onLogin и onSignOut. Эти обработчики переданы в соответствующие компоненты: Register.js, Login.js, Header.js
function Header ({onSignOut, email , onSignUp, onSignIn, route}) {
  function handleSignOut(){
    onSignOut();
  }
  function handleSignUp(){
    onSignUp();
  }
  function handleSignIn(){
    onSignIn();
  }
  function switchAction(){
    switch (route) {
      case '/':
        return (<button className="header__logout" onClick={handleSignOut}>Выйти</button>
      )
      case '/signup':
        return  <button className="header__logout" onClick={handleSignIn}>Войти</button>
      case '/signin':
        return <button className="header__logout" onClick={handleSignUp}>Регистрация</button>
      default:
        return null;
    }
  }
  return (
    <header className="header page__section">
      <img src={logoPath} alt="Логотип проекта Mesto" className="logo header__logo" />
      <div className="header__wrapper">
        {switchAction()}
      </div>

    </header>
  )
}

export default Header
