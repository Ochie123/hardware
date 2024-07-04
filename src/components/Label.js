import React from 'react';
import styled, { css } from 'styled-components';
import clsx from 'clsx';

const Label = ({ className = '', color = 'secondary', children, style, ...rest }) => {
  return (
    <StyledSpan className={clsx(color, className)} style={style} {...rest}>
      {children}
    </StyledSpan>
  );
};

const colors = {
  primary: '#3f51b5',
  secondary: '#f50057',
  error: '#f44336',
  warning: '#ff9800',
  success: '#4caf50',
};

const backgrounds = {
  primary: 'rgba(63, 81, 181, 0.08)',
  secondary: 'rgba(245, 0, 87, 0.08)',
  error: 'rgba(244, 67, 54, 0.08)',
  warning: 'rgba(255, 152, 0, 0.08)',
  success: 'rgba(76, 175, 80, 0.08)',
};

const StyledSpan = styled.span`
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  align-items: center;
  border-radius: 2px;
  display: inline-flex;
  flex-grow: 0;
  white-space: nowrap;
  cursor: default;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 500;
  height: 20px;
  justify-content: center;
  letter-spacing: 0.5px;
  min-width: 20px;
  padding: 4px 8px;
  text-transform: uppercase;

  ${props => props.className && css`
    color: ${colors[props.className]};
    background-color: ${backgrounds[props.className]};
  `}
`;

export default Label;
