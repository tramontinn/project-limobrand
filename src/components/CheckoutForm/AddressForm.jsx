import React, { useState, useEffect } from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core';
import { useForm, FormProvider } from 'react-hook-form';
import {Link} from 'react-router-dom';

import { commerce } from '../../lib/commerce';

import FormInput from './CustomTextField';
import reactRouterDom from 'react-router-dom';

const AddressForm = ({ checkoutToken, next }) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState('');
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState('');
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState('');
  const methods = useForm();

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({ id: code, label: name}));
  const subdivision = Object.entries(shippingSubdivisions).map(([code, name]) => ({ id: code, label: name}));
  const options = shippingOptions.map((sO) => ({ id:sO.id, label: `${sO.description} - (${sO.price.formatted_with_symbol})` }));

  console.log(shippingOptions);

  const fetchShippingCountries = async(checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId);

    setShippingCountries(countries);
    setShippingCountry(Object.keys(countries)[0]);
  } 

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);

    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);

  }

  const fetchShippingOptions = async(checkoutTokenId, country, region = null) => {
    const options = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region });

    setShippingOptions(options);
    setShippingOption(options[0].id);
  }

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id)
  }, []);

  useEffect(() => {
    if(shippingCountry) fetchSubdivisions(shippingCountry);
  }, [shippingCountry]);

  useEffect(() => {
    if(shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
  }, [shippingSubdivision]);

  return (
    <>
      <Typography variant="h6" gutterBottom>Endereço de envio</Typography>
        <FormProvider { ...methods}>
          <form onSubmit={methods.handleSubmit((data) => next({...data, shippingCountry, shippingSubdivision, shippingOption}))}>
            <Grid container spacing={3}>
              <FormInput  name='firstName' label='Primeiro nome' />
              <FormInput  name='lastName' label='Último nome' />
              <FormInput  name='adress1' label='Endereço' />
              <FormInput  name='adress2' label='Número' />
              <FormInput  name='email' label='E-mail' />
              <FormInput  name='cidade' label='Cidade' />
              <FormInput  name='cep' label='CEP' />
              <Grid item xs={12} sm={6}>
                <InputLabel> País </InputLabel>
                <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
                  {countries.map((country) => (
                    <MenuItem key={country.id} value={country.id}>{country.label}</MenuItem> 
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Estado</InputLabel>
                <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
                  {subdivision.map((subdivision) => (
                    <MenuItem key={subdivision.id} value={subdivision.id}>{subdivision.label}</MenuItem> 
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} sm={6}>
                <InputLabel>Entrega</InputLabel>
                <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
                {options.map((option) => (
                    <MenuItem key={option.id} value={option.id}>{option.label}</MenuItem>
                ))}
                </Select>
              </Grid>
            </Grid>
            <br />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button component={Link} to="/carrinho" variant="outlined">Voltar para o carrinho</Button>
                  <Button type="submit" variant="contained" color="primary">Próximo</Button>
            </div>
          </form>
        </FormProvider>
    </>
  )
};

export default AddressForm;
