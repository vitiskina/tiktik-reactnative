import sanityClient from '@sanity/client';

export const client = sanityClient({
  projectId: 'ue93m5w3',
  dataset: 'production',
  apiVersion: '2022-03-10',
  useCdn: false,
  token: 'sk7bpH7ZM1rQyJf3LmPa4Ts9dGtENEVnI8OmM2SS46QIxUMLvBdeNwfKGaRQeSHdYlHPMc2DzF2cbbM2sZXMAI6dQNoE9AHrP8UkhucSLShm8sZ6RYWe1ySmeot1IUFiVvS8gtuNtpY1c5hU99rIaXbShFeWbCCoHLnzh9nJlXeLibCrmhQB',
});

export default client;

