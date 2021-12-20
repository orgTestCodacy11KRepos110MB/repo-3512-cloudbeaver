/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import styled, { css } from 'reshadow';

import { BASE_CONTAINERS_STYLES, Group, GroupItem, GroupTitle } from '@cloudbeaver/core-blocks';
import { useTranslate } from '@cloudbeaver/core-localization';
import { useStyles } from '@cloudbeaver/core-theming';

const style = css`
  Group {
    composes: theme-typography--body2 from global;
  }
  GroupItem {
    white-space: pre-line;
  }
  h4 {
    margin-top: 0;
  }
  ol {
    margin: 0;
    padding: 0;
  }
`;

export const Instructions = observer(function Instructions() {
  const translate = useTranslate();
  const styles = useStyles(BASE_CONTAINERS_STYLES, style);

  return styled(styles)(
    <Group form gap>
      <GroupTitle>{translate('version_update_how_to_update')}</GroupTitle>
      <GroupItem>
        <h4>
          Our team suggests not to downgrade to ensure that the version transition process will not affect the program's functionality.<br />
          The following instructions are only relevant if you run CloudBeaver as a Docker container.
        </h4>
        <ol>
          <li>Stop the existing container by running the <strong>docker stop</strong> command.</li>
          <li>Use the <strong>docker rm</strong> command to remove it.</li>
          <li>Use the <strong>docker pull</strong> command to download the image from the Docker Hub. </li>
          <li>Re-create the container by executing the <strong>docker run</strong> command. </li>
        </ol>
      </GroupItem>
    </Group>
  );
});
