import React, {Suspense} from "react";
import { Route, useHistory, Switch } from "react-router-dom";
//import Main from "../../../mf_layout/src/Components/Main";

import PopupWithForm from "./PopupWithForm";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from 'frontend_shared-context';

import AddPlacePopup from "./AddPlacePopup";


import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth.js";

const Header = React.lazy(() => import("mf_layout/Header"));
const Footer = React.lazy(() => import("mf_layout/Footer"));
const Main = React.lazy(() => import("mf_layout/Main"));

const Login = React.lazy(() => import("mf_auth/Login"));
const Register = React.lazy(() => import("mf_auth/Register"));

const EditProfilePopup = React.lazy(() => import("mf_profile/EditProfilePopup"));
const EditAvatarPopup = React.lazy(() => import("mf_profile/EditAvatarPopup"));
function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(null);
  const [cards, setCards] = React.useState([]);

  // В корневом компоненте App создана стейт-переменная currentUser. Она используется в качестве значения для провайдера контекста.
  const [currentUser, setCurrentUser] = React.useState({});

  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [tooltipStatus, setTooltipStatus] = React.useState("");

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  //В компоненты добавлены новые стейт-переменные: email — в компонент App
  const [email, setEmail] = React.useState("");

  const history = useHistory();

  // Запрос к API за информацией о пользователе и массиве карточек выполняется единожды, при монтировании.
  React.useEffect(() => {
    api
      .getAppInfo()
      .then(([cardData, userData]) => {
        setCurrentUser(userData);
        setCards(cardData);
      })
      .catch((err) => console.log(err));
  }, []);

  // при монтировании App описан эффект, проверяющий наличие токена и его валидности
  React.useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      auth
        .checkToken(token)
        .then((res) => {
          setEmail(res.data.email);
          setIsLoggedIn(true);
          history.push("/");
        })
        .catch((err) => {
          localStorage.removeItem("jwt");
          console.log(err);
        });
    }
  }, [history]);

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function closeAllPopups() {
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsEditAvatarPopupOpen(false);
    setIsInfoToolTipOpen(false);
    setSelectedCard(null);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleUpdateUser(userUpdate) {
    api
      .setUserInfo(userUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatarUpdate) {
    api
      .setUserAvatar(avatarUpdate)
      .then((newUserData) => {
        setCurrentUser(newUserData);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);
    api
      .changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((cards) =>
          cards.map((c) => (c._id === card._id ? newCard : c))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleCardDelete(card) {
    api
      .removeCard(card._id)
      .then(() => {
        setCards((cards) => cards.filter((c) => c._id !== card._id));
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newCard) {
    api
      .addCard(newCard)
      .then((newCardFull) => {
        setCards([newCardFull, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function onRegister({ email, password }) {
    auth
      .register(email, password)
      .then((res) => {
        setTooltipStatus("success");
        setIsInfoToolTipOpen(true);
        history.push("/signin");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onLogin({ email, password }) {
    auth
      .login(email, password)
      .then((res) => {
        setIsLoggedIn(true);
        setEmail(email);
        history.push("/");
      })
      .catch((err) => {
        setTooltipStatus("fail");
        setIsInfoToolTipOpen(true);
      });
  }

  function onSignOut() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }
  function onSignUp() {
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signup");
  }
  function onSignIn() {
    // при вызове обработчика onSignOut происходит удаление jwt
    localStorage.removeItem("jwt");
    setIsLoggedIn(false);
    // После успешного вызова обработчика onSignOut происходит редирект на /signin
    history.push("/signin");
  }
  return (
    // В компонент App внедрён контекст через CurrentUserContext.Provider
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page__content">

          <Route exact path="/" >
            <Suspense fallback={<div>Loading...</div>}>
              <Header email={email} onSignOut={onSignOut} onSignUp={onSignUp} onSignIn={onSignIn} route="/" />
            </Suspense>
          </Route>
          <Route path="/signup" >
            <Suspense fallback={<div>Loading...</div>}>
              <Header email={email} onSignOut={onSignOut} onSignUp={onSignUp} onSignIn={onSignIn} route="/signup" />
            </Suspense>
          </Route>
          <Route path="/signin" >
            <Suspense fallback={<div>Loading...</div>}>
              <Header email={email} onSignOut={onSignOut} onSignUp={onSignUp} onSignIn={onSignIn} route="/signin" />
            </Suspense>
          </Route>


        <Switch>
          {/*Роут / защищён HOC-компонентом ProtectedRoute*/}
          <Suspense fallback={<div>Loading...</div>}>
          <ProtectedRoute
            exact
            path="/"
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
            loggedIn={isLoggedIn}
          />
          </Suspense>
          {/*Роут /signup и /signin не является защищёнными, т.е оборачивать их в HOC ProtectedRoute не нужно.*/}
          <Route path="/signup">
            <Suspense fallback={<div>Loading...</div>}>
              <Register onRegister={onRegister} onSignIn={onSignIn} />
            </Suspense>

          </Route>
          <Route path="/signin">
            <Suspense fallback={<div>Loading...</div>}>
              <Login onLogin={onLogin} onSignIn={onSignIn} />
            </Suspense>
          </Route>
        </Switch>
        <Suspense fallback={<div>Loading...</div>}>
          <Footer />
        </Suspense>
        <Suspense fallback={<div>Loading...</div>}>
          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onUpdateUser={handleUpdateUser}
            onClose={closeAllPopups}
          />
        </Suspense>
        <AddPlacePopup
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
          onClose={closeAllPopups}
        />
        <PopupWithForm title="Вы уверены?" name="remove-card" buttonText="Да" />
        <Suspense fallback={<div>Loading...</div>}>
          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onUpdateAvatar={handleUpdateAvatar}
            onClose={closeAllPopups}
          />
        </Suspense>
        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          isOpen={isInfoToolTipOpen}
          onClose={closeAllPopups}
          status={tooltipStatus}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
