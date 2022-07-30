import detectEthereumProvider from "@metamask/detect-provider";
import { useState, useEffect } from 'react';
import Head from "next/head"

import Greeter from "artifacts/contracts/Greeters.sol/Greeters.json"

import { useFormik } from 'formik';
import * as yup from 'yup';
import { Contract, providers, utils } from "ethers"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [greeting, setGreeting] = useState('');
  useEffect(() => {(async () => {
    const provider = (await detectEthereumProvider()) as any;
    const ethers = new providers.Web3Provider(provider);
    provider.pollingInterval = 1000;

    const contract = new Contract(
      "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
      Greeter.abi,
      ethers
    );
      
    contract.on('NewGreeting', (greeting) => {
      greeting = utils.parseBytes32String(greeting);
      setGreeting(greeting)
    });

    console.log(contract)
  }) ();}, []);

  const formik = useFormik({
    initialValues: {
      age: '',
      name: '',
      address: '',
    },
    onSubmit: (values) => {
      setMessage('Form submitted');
      setSubmitted(true);
      console.log(values)
    },
    validationSchema: yup.object({
      name: yup.string().trim().required('Name is required'),
      age: yup
        .number()
        .required('Age is required')
        .min(18, "You must be at least 18 years old")
        .max(150, "Are you sure?"),
      address: yup.string().trim(),
    }),
  });
  
  return (<div className="vh-100 d-flex flex-column justify-content-center align-items-center">
    <Head>
        <title>ZKU-W4 Assignment</title>
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div hidden={!submitted} className="alert alert-primary" role="alert">
        {message}
    </div>
    <form className="w-50" onSubmit={formik.handleSubmit}>
        <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
                type="text"
                name="name"
                className="form-control"
                placeholder="Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.name && (
                <div className="text-danger">{formik.errors.name}</div>
            )}
        </div>
        <div className="mb-3">
            <label htmlFor="age" className="form-label">Age</label>
            <input
                type="number"
                name="age"
                className="form-control"
                placeholder="21"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.age && (
                <div className="text-danger">{formik.errors.age}</div>
            )}
        </div>
        <div className="mb-3">
            <label htmlFor="address" className="form-label">Address</label>
            <input
                type="text"
                name="address"
                className="form-control"
                placeholder="187, Boulevard St. NYNY"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
            />
            {formik.errors.address && (
                <div className="text-danger">{formik.errors.address}</div>
            )}
        </div>
        <button type="submit" className="btn btn-primary">
            Send
        </button>
    </form>
    <p>{greeting}</p>
  </div>);
}
