import React, { ChangeEvent, FormEvent, useRef, useState } from "react";
import "./App.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
import { faFacebookF } from "@fortawesome/free-brands-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faPinterest } from "@fortawesome/free-brands-svg-icons";
import ReCAPTCHA from "react-google-recaptcha";

type FormState = {
  email: string;
  name: string;
  message: string;
};

type ServiceMessage = {
  class: string;
  text: string;
};
function App() {
  const formId = "";
  const formSparkUrl = `https://submit-form.com/${formId}`;
  const recaptchaKey = "6Lf70WsiAAAAAOyk0ed2CE4i2vb5zB5kz3DdrsrC";
  const recaptchaRef = useRef<any>();

  const initialFormState = {
    email: "",
    name: "",
    message: "",
  };

  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<ServiceMessage>();
  const [recaptchaToken, setReCaptchaToken] = useState<string>();

  const submitForm = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    await postSubmission();
    setSubmitting(false);
  };

  const postSubmission = async () => {
    const payload = {
      ...formState,
      "g-recaptcha-response": recaptchaToken,
    };

    try {
      const result = await axios.post(formSparkUrl, payload);
      console.log(result);
      setMessage({
        class: "bg-green-500",
        text: "Thank you.",
      });
      setFormState(initialFormState);
      recaptchaRef.current.reset();
    } catch (error) {
      console.log(error);
      setMessage({
        class: "bg-red-500",
        text: "Sorry, there was a problem. Please try again.",
      });
    }
  };

  const updateFormControl = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = event.target;
    const key = id as keyof FormState;
    const updatedFormState = { ...formState };
    updatedFormState[key] = value;
    setFormState(updatedFormState);
  };

  const updateRecaptchaToken = (token: string | null) => {
    setReCaptchaToken(token as string);
  };

  return (
    <div className="">
      <div className="Container">
        <h1>
          <span>Reach out to us!</span>
        </h1>
        {message && <div className={`${message.class}`}>{message.text}</div>}
        <form onSubmit={submitForm} className="">
          <input
            onChange={updateFormControl}
            className=""
            type="text"
            id="name"
            value={formState?.name}
            placeholder="Your name*"
          />
          <input
            onChange={updateFormControl}
            className=""
            type="email"
            id="email"
            value={formState?.email}
            placeholder="Your email*"
          />
          <textarea
            onChange={updateFormControl}
            className=""
            id="message"
            value={formState?.message}
            placeholder="Your message*"
          ></textarea>

          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={recaptchaKey}
            onChange={updateRecaptchaToken}
          />

          <button disabled={submitting} className="">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <footer className="social-links d-flex p-2 justify-content-sm-around">
        <a href="http://www.linkedin.com">
          <FontAwesomeIcon icon={faLinkedinIn} />
        </a>
         <a href="http://www.twitter.com">
          <FontAwesomeIcon icon={faTwitter} />
        </a>
        <a href="http://www.facebook.com">
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a href="http://www.pinterest.com">
          <FontAwesomeIcon icon={faPinterest} />
        </a>
      </footer>
    </div>
  );
}

export default App;
