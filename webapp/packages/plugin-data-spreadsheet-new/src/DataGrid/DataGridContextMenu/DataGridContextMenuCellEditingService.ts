/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';
import { isBooleanValuePresentationAvailable, ResultSetChangeType, ResultSetDataAction, ResultSetEditAction, ResultSetFormatAction, ResultSetViewAction } from '@cloudbeaver/plugin-data-viewer';

import { DataGridContextMenuService } from './DataGridContextMenuService';

@injectable()
export class DataGridContextMenuCellEditingService {
  private static menuEditingToken = 'menuEditing';

  constructor(
    private dataGridContextMenuService: DataGridContextMenuService
  ) { }

  getMenuEditingToken(): string {
    return DataGridContextMenuCellEditingService.menuEditingToken;
  }

  register(): void {
    this.dataGridContextMenuService.add(
      this.dataGridContextMenuService.getMenuToken(),
      {
        id: this.getMenuEditingToken(),
        order: 4,
        title: 'data_grid_table_editing',
        icon: 'edit',
        isPanel: true,
        isPresent(context) {
          return context.contextType === DataGridContextMenuService.cellContext;
        },
        isHidden(context) {
          return context.data.model.isDisabled(context.data.resultIndex)
            || context.data.model.isReadonly();
        },
      }
    );
    this.dataGridContextMenuService.add(
      this.getMenuEditingToken(),
      {
        id: 'open_inline_editor',
        order: 0,
        title: 'data_grid_table_editing_open_inline_editor',
        icon: 'edit',
        isPresent(context) {
          return context.contextType === DataGridContextMenuService.cellContext;
        },
        isHidden(context) {
          const format = context.data.model.source.getAction(context.data.resultIndex, ResultSetFormatAction);
          const view = context.data.model.source.getAction(context.data.resultIndex, ResultSetViewAction);
          const cellValue = view.getCellValue(context.data.key);
          const column = view.getColumn(context.data.key.column);

          if (!column || cellValue === undefined || format.isReadOnly(context.data.key)) {
            return true;
          }

          return isBooleanValuePresentationAvailable(cellValue, column);
        },
        onClick(context) {
          context.data.spreadsheetActions.edit(context.data.key);
        },
      }
    );
    this.dataGridContextMenuService.add(
      this.getMenuEditingToken(),
      {
        id: 'set_to_null',
        order: 1,
        title: 'data_grid_table_editing_set_to_null',
        isPresent(context) {
          return context.contextType === DataGridContextMenuService.cellContext;
        },
        isHidden(context) {
          const { key, model, resultIndex } = context.data;
          const data = model.source.getAction(resultIndex, ResultSetDataAction);
          const format = model.source.getAction(resultIndex, ResultSetFormatAction);
          const cellValue = data.getCellValue(key);

          return cellValue === undefined || data.getColumn(key.column)?.required || format.isNull(cellValue);
        },
        onClick(context) {
          context.data.model.source.getAction(context.data.resultIndex, ResultSetEditAction)
            .set(context.data.key, null);
        },
      }
    );
    this.dataGridContextMenuService.add(
      this.getMenuEditingToken(),
      {
        id: 'row_add',
        order: 5,
        title: 'data_grid_table_editing_row_add',
        isPresent(context) {
          return context.contextType === DataGridContextMenuService.cellContext;
        },
        onClick(context) {
          const editor = context.data.model.source.getAction(context.data.resultIndex, ResultSetEditAction);
          editor.addRow(context.data.key.row);
        },
      }
    );
    this.dataGridContextMenuService.add(
      this.getMenuEditingToken(),
      {
        id: 'row_delete',
        order: 6,
        title: 'data_grid_table_editing_row_delete',
        isPresent(context) {
          return context.contextType === DataGridContextMenuService.cellContext;
        },
        isHidden(context) {
          const editor = context.data.model.source.getAction(context.data.resultIndex, ResultSetEditAction);
          const format = context.data.model.source.getAction(context.data.resultIndex, ResultSetFormatAction);
          return (
            format.isReadOnly(context.data.key)
            || editor.getElementState(context.data.key) === ResultSetChangeType.delete
          );
        },
        onClick(context) {
          const editor = context.data.model.source.getAction(context.data.resultIndex, ResultSetEditAction);
          editor.deleteRow(context.data.key.row);
        },
      }
    );
    this.dataGridContextMenuService.add(
      this.getMenuEditingToken(),
      {
        id: 'row_revert',
        order: 7,
        title: 'data_grid_table_editing_row_revert',
        isPresent(context) {
          return context.contextType === DataGridContextMenuService.cellContext;
        },
        isHidden(context) {
          const editor = context.data.model.source.getAction(context.data.resultIndex, ResultSetEditAction);
          return editor.getElementState(context.data.key) === null;
        },
        onClick(context) {
          const editor = context.data.model.source.getAction(context.data.resultIndex, ResultSetEditAction);
          editor.revert(context.data.key);
        },
      }
    );
  }
}
