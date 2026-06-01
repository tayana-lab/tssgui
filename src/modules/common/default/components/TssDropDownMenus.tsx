import { styled } from 'styled-components';
import { StyledDropdown } from './common';

export const UserHeader = styled.li`
  background: linear-gradient(to right, #ffffff, #c4b0f3) !important;
  height:auto !important;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top:10px;
  text-align: center;
  img {
    z-index: 5;
    height: 90px;
    width: 90px;
    border: 3px solid;
    border-color: transparent;
    border-color: rgba(255, 255, 255, 0.2);
  }
  p {
    z-index: 5;
    font-size: 17px;
    margin-top: 10px;
    small {
      display: block;
      font-size: 12px;
    }
  }
`;

export const UserBody = styled.li` 
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  border-bottom: 1px solid #495057;
  border-top: 1px solid #dee2e6;
  padding: 15px;
  &::after {
    display: block;
    clear: both;
    content: '';
  }

  @media (min-width: 576px) {
    a {
      color: #495057 !important;
    }
  }
`;

export const UserFooter = styled.li`
  background-color: linear-gradient(to right, $tss-light-color, $tss-option-hover) !important;
  &::after {
    display: block;
    clear: both;
    content: '';
  }
  .btn-default {
    color: #6c757d;
  }

  @media (min-width: 576px) {
    .btn-default:hover {
      background-color: #f8f9fa;
    }
  }
`;

export const UserMenuDropdown = styled(StyledDropdown)`
  --pf-dropdown-menu-min-width: 230px;
--pf-dropdown-menu-margin-right : 29px;
`;

export const MessagesMenu = styled(StyledDropdown)`
  --pf-dropdown-menu-min-width: 18rem;
`;

export const SearchMenu = styled(StyledDropdown)`
  --pf-dropdown-menu-min-width: 18rem;
`;

export const NotificationMenu = styled(StyledDropdown)`
  --pf-dropdown-menu-min-width: 18rem;
`;

export const SuggestionMenu = styled(StyledDropdown)`
  --pf-dropdown-menu-min-width: 18rem;
`;

export const ProductsMenu = styled(StyledDropdown)`
--pf-dropdown-menu-min-width: 320px;
`;
