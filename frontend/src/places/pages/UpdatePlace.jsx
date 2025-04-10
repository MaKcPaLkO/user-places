import { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/Modal/ErrorModal";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH} from "../../shared/util/validators";

import { AuthContext } from "../../shared/context/auth-context";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";

const UpdatePlace = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlace, setLoadedPlace] = useState()

  const { placeId } = useParams();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm({
    title: {
      value: "",
      isValid: false
    },
    description: {
      value: "",
      isValid: false
    },
    image: {
      value: "",
      isValid: false
    }
  }, false)

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(`${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`)
        setLoadedPlace(responseData.place);
        setFormData({
          title: {
            value: responseData.place.title,
            isValid: true
          },
          description: {
            value: responseData.place.description,
            isValid: true
          },
          image: {
            value: responseData.place.image,
            isValid: true
          }
        }, true)
      } catch (err) {}
    }
    fetchPlace();
  }, [sendRequest, placeId, setFormData])


  const placeUpdateSubmitHandler = async event => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('title', formState.inputs.title.value);
    formData.append('description', formState.inputs.description.value);
    formData.append('image', formState.inputs.image.value);

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`,
        'PATCH',
        formData,
        {Authorization: "Bearer " + auth.token}
      );
      history.push(`/${auth.userId}/places`);
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!loadedPlace && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find place!</h2>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
        <Input
          id="title"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          initialValue={formState.inputs.title.value}
          initialValid={formState.inputs.title.isValid}
        />
        <Input
          id="description"
          type="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (min. 5 characters)."
          onInput={inputHandler}
          initialValue={formState.inputs.description.value}
          initialValid={formState.inputs.description.isValid}
        />
        <ImageUpload id="image" center onInput={inputHandler} initialImage={formState.inputs.image.value}/>
        <Button type="submit" disabled={!formState.isValid}>Update place</Button>
      </form>}
    </>
  )
}

export default UpdatePlace;
