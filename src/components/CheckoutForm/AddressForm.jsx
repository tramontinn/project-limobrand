import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';

import { commerce } from '../../lib/commerce';

import FormInput from './CustomTextField';

const AddressForm = ({ checkoutToken }) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name}));
  console.log(countries);

  const fetchShippingCountries = async(checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  } 

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id)
  }, []);

  return (
    <>
      <Typography variant="h6" gutterBottom>Endereço de envio</Typography>
        <FormProvider { ...methods}>
          <form onSubmit=''>
            <Grid container spacing={3}>
              <FormInput required name='firstName' label='Primeiro nome' />
              <FormInput required name='lastName' label='Último nome' />
              <FormInput required name='adress1' label='Endereço' />
              <FormInput required name='adress2' label='Número' />
              <FormInput required name='email' label='E-mail' />
              <FormInput required name='cidade' label='Cidade' />
              <FormInput required name='cep' label='CEP' />
              <Grid item xs={12} sm={6}>
                <InputLabel> País da compra </InputLabel>
                <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>
                      {country.label}
                     </MenuItem> 
                  ))}
                </Select>
              </Grid>
              {/* <Grid item xs={12} sm={6}>
                <InputLabel>Estado da compra</InputLabel>
                <Select value={} fullWidth onChange={}>
                  <MenuItem key={} value={}>
                    Select Me
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Opções da compra</InputLabel>
                <Select value={} fullWidth onChange={}>
                  <MenuItem key={} value={}>
                    Select Me
                  </MenuItem>
                </Select>
              </Grid> */}
            </Grid>
          </form>
        </FormProvider>
    </>
  )
};

export default AddressForm;
