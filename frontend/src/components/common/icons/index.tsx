import React from 'react';
import { Image, ImageProps } from 'react-bootstrap';
import SearchSvg from '../../../assets/images/icon-search.svg';

export type IconProps = ImageProps & {
  /** Adds a custom class to the <img> element of the <Icon> component */
  className?: string;
};

export const SearchIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <Image src={SearchSvg} {...props} className={className} />
);
