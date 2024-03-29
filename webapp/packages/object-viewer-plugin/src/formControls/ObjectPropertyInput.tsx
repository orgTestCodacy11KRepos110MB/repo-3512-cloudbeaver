/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import styled, { css } from 'reshadow';

import { useStyles } from '@dbeaver/core/theming';

import { additionalProps, getValue, matchType } from '../tools';
import { ObjectPropertyProps } from './ObjectPropertyProps';

const styles = css`
  form-input {
    display: flex;
    width: 100%;
  }
  label-wrapper {
    width: 25%;
    box-sizing: border-box;
    padding-right: 8px;
  }
  input-wrapper {
    width: 75%;
    box-sizing: border-box;
    padding-left: 8px;
  }
  input {
    font-size: 13px;
    line-height: 24px;
  }
  label {
    text-align: right;
    font-size: 13px;
    line-height: 26px;
  }
`;

export const ObjectPropertyInput = observer(function ObjectPropertyInput({ objectProperty }: ObjectPropertyProps) {
  if (!objectProperty) {
    return null;
  }

  return styled(useStyles(styles))(
    <form-input as="div">
      <label-wrapper as="div">
        <label htmlFor={objectProperty.id}
          title={objectProperty.displayName}>{objectProperty.displayName}</label>
      </label-wrapper>
      <input-wrapper as="div">
        <input
          type={matchType(objectProperty.dataType)}
          value={getValue(objectProperty.value as any)}
          {...additionalProps(objectProperty)}
          readOnly={true}
        />
      </input-wrapper>
    </form-input>
  );
});
