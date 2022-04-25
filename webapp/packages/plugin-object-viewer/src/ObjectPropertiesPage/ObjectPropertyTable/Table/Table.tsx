/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2022 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useRef } from 'react';
import DataGrid, { DataGridHandle } from 'react-data-grid';
import styled, { css } from 'reshadow';

import { DBObject, NavTreeResource } from '@cloudbeaver/core-app';
import { useTable } from '@cloudbeaver/core-blocks';
import { useService } from '@cloudbeaver/core-di';
import { Translate } from '@cloudbeaver/core-localization';
import type { ObjectPropertyInfo } from '@cloudbeaver/core-sdk';
import { useStyles } from '@cloudbeaver/core-theming';
import { isDefined, TextTools } from '@cloudbeaver/core-utils';

import { getValue } from '../../helpers';
import { ObjectPropertyTableFooter } from '../ObjectPropertyTableFooter';
import { CellFormatter } from './CellFormatter';
import { ColumnIcon } from './Columns/ColumnIcon/ColumnIcon';
import { ColumnSelect } from './Columns/ColumnSelect/ColumnSelect';
import { RowRenderer } from './RowRenderer';
import baseStyles from './styles/base.scss';
import { tableStyles } from './styles/styles';
import { TableContext } from './TableContext';
import { useTableData } from './useTableData';

const style = css`
    wrapper {
      composes: theme-typography--body2 from global;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    DataGrid {
      width: 100%;
      height: 100%;
    }
    data-info {
      padding: 4px 12px;
    }
    ObjectPropertyTableFooter {
      composes: theme-background-secondary theme-text-on-secondary theme-border-color-background from global;
      border-top: 1px solid;
    }
  `;

interface Props {
  objects: DBObject[];
  truncated?: boolean;
}

function getMeasuredCells(columns: ObjectPropertyInfo[], rows: DBObject[]) {
  const columnNames = columns.map(column => column.displayName).filter(isDefined);

  let rowStrings: string[] = [];

  for (const row of rows.slice(0, 100)) {
    if (row.object?.properties) {
      if (rowStrings.length === 0) {
        rowStrings = row.object.properties.map(p => getValue(p.value));
        continue;
      }

      for (let i = 0; i < row.object.properties.length; i++) {
        const value = getValue(row.object.properties[i].value);

        if (value.length > rowStrings[i].length) {
          rowStrings[i] = value;
        }
      }
    }
  }

  return TextTools.getWidth({
    font: '400 12px Roboto',
    text: columnNames.map((cell, i) => {
      if (cell.length > (rowStrings[i] || '').length) {
        return cell;
      }
      return rowStrings[i];
    }),
  }).map(v => v + 32 + 8);
}

const CUSTOM_COLUMNS = [ColumnSelect, ColumnIcon];

export const Table = observer<Props>(function Table({
  objects,
  truncated,
}) {
  const ref = useRef<DataGridHandle | null>(null);
  const navTreeResource = useService(NavTreeResource);
  const styles = useStyles(style, baseStyles, tableStyles);
  const tableState = useTable();

  const baseObject = objects
    .slice()
    .sort((a, b) => (a.object?.properties?.length || 0) - (b.object?.properties?.length || 0));

  const nodeIds = objects.map(object => object.id);
  const properties = baseObject[0].object?.properties || [];
  const measuredCells = getMeasuredCells(properties, objects);

  const dataColumns = properties.map((property, index) => ({
    key: property.id!,
    name: property.displayName ?? '',
    columnDataIndex: null,
    width: Math.min(300, measuredCells[index]),
    minWidth: 40,
    resizable: true,
    formatter: CellFormatter,
  }));

  const tableData = useTableData(dataColumns, CUSTOM_COLUMNS);

  if (objects.length === 0) {
    return null;
  }

  return styled(styles)(
    <TableContext.Provider value={{ tableData, tableState }}>
      <wrapper>
        <DataGrid
          ref={ref}
          className='cb-metadata-grid-theme'
          rows={objects}
          rowKeyGetter={row => row.id}
          rowRenderer={RowRenderer}
          columns={tableData.columns}
          rowHeight={40}
        />
        {truncated && (
          <data-info>
            <Translate token='app_navigationTree_limited' limit={navTreeResource.childrenLimit} />
          </data-info>
        )}
        <ObjectPropertyTableFooter nodeIds={nodeIds} tableState={tableState} />
      </wrapper>
    </TableContext.Provider>
  );
});