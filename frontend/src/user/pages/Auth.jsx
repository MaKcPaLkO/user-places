import { useState, useContext } from "react";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE, VALIDATOR_EMAIL} from "../../shared/util/validators";

import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: '',
      isValid: false
    },
    password: {
      value: '',
      isValid: false
    }
  }, false)

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData({
        ...formState.inputs,
        name: undefined,
        image: undefined
      }, formState.inputs.email.isValid && formState.inputs.password.isValid);
    } else {
      setFormData({
        ...formState.inputs,
        name: {
          value: '',
          isValid: false
        },
        image: {
          value: null,
          isValid: false
        }
      }, false);
    }
    setIsLoginMode(prevMode => !prevMode);
  }

  const userSubmitHandler = async event => {
    event.preventDefault();

    if (isLoginMode) {
      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/login`, "POST",
        JSON.stringify({
          email: formState.inputs.email.value,
          password: formState.inputs.password.value
        }),
        {
          'Content-Type': 'application/json'
        }
      );

      auth.login(responseData.userId, responseData.token);
    } else {
      const formData = new FormData();
      formData.append('email', formState.inputs.email.value);
      formData.append('name', formState.inputs.name.value);
      formData.append('password', formState.inputs.password.value);
      formData.append('image', formState.inputs.image.value);

      const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/users/signup`,
        "POST",
        formData
      );

      auth.login(responseData.userId, responseData.token);
    }
  }


  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card>
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <form className="place-form" onSubmit={userSubmitHandler}>
          {!isLoginMode && <Input
            id="name"
            type="text"
            label="Your name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name"
            onInput={inputHandler}
          />}
          {!isLoginMode && <ImageUpload id="image" center onInput={inputHandler} />}
          <Input
            id="email"
            type="text"
            label="Your email"
            validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            type="password"
            label="Your password"
            validators={[ VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password. at least 6 chars."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>{isLoginMode ? 'Login' : 'Signup' }</Button>
        </form>
        <Button inverse onClick={switchModeHandler}>Switch to {isLoginMode ? 'signup' : 'login' }</Button>
      </Card>
    </>
  )
}

export default Auth;
