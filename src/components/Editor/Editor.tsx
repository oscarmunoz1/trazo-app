/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

// Chakra imports
import { Box, Button } from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useState } from 'react';

import ReactQuill from 'react-quill';

const CustomToolbar = () => (
  <Box
    id="toolbar"
    borderTopStartRadius="15px"
    borderTopEndRadius="15px"
    borderBottom="0px solid transparent !important"
  >
    <select className="ql-header" defaultValue={''} onChange={(e) => e.persist()}>
      <option value="1"></option>
      <option value="2"></option>
      <option selected></option>
    </select>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-bold"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-italic"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-underline"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      me="5px !important"
      className="ql-list"
      value="ordered"
    ></Button>
    <Button
      display="flex !important"
      justifyContent="center !important"
      alignItems="center !important"
      className="ql-list"
      value="bullet"
    ></Button>
  </Box>
);

const Editor = () => {
  const {
    control,
    formState: { errors }
  } = useFormContext();

  return (
    <div className="text-editor">
      <CustomToolbar />
      <Controller
        name="description"
        control={control}
        mb="100px"
        render={({ field }) => (
          <ReactQuill
            {...field}
            onChange={field.onChange}
            placeholder={''}
            modules={Editor.modules}
            value={field.value}
            style={{
              height: '250px'
            }}
          />
        )}
      />
    </div>
  );
};

Editor.modules = {
  toolbar: [
    [{ size: [] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }, 'link']
  ],
  clipboard: {
    matchVisual: false
  }
};

Editor.modules = {
  toolbar: {
    container: '#toolbar'
  },
  clipboard: {
    matchVisual: false
  }
};

Editor.formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color'
];

export default Editor;
