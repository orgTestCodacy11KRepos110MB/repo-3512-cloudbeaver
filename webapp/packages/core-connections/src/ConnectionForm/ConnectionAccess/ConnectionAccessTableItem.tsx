/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useContext } from 'react';
import styled, { css } from 'reshadow';

import { StaticImage, TableColumnValue, TableContext, TableItem, TableItemSelect } from '@cloudbeaver/core-blocks';

interface Props {
  id: any;
  name: string;
  icon: string;
  disabled: boolean;
  iconTooltip?: string;
  tooltip?: string;
  description?: string;
  className?: string;
}

const style = css`
  StaticImage {
    display: flex;
    width: 24px;
  }
`;

export const ConnectionAccessTableItem = observer<Props>(function ConnectionAccessTableItem({
  id, name, description, icon, iconTooltip, tooltip, disabled: tableDisabled, className,
}) {
  const tableContext = useContext(TableContext);

  if (!tableContext) {
    throw new Error('Context must be provided');
  }

  const disabled = tableDisabled || tableContext.state.isItemSelectable?.(id) === false;

  return styled(style)(
    <TableItem
      item={id}
      title={tooltip}
      disabled={disabled}
      selectDisabled={disabled}
      className={className}
    >
      <TableColumnValue centerContent flex>
        <TableItemSelect disabled={disabled} />
      </TableColumnValue>
      <TableColumnValue><StaticImage icon={icon} title={iconTooltip} /></TableColumnValue>
      <TableColumnValue>{name}</TableColumnValue>
      <TableColumnValue>{description}</TableColumnValue>
    </TableItem>
  );
});
