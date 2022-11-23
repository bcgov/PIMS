import React from 'react';

export type ILayoutWrapperProps = {
  layout?: React.ComponentType<any>;
  component: React.ComponentType<any>;
  componentProps?: any;
  title?: string;
};

// TODO: This component needs to be deleted.  Title functionality moved to layout.
export const LayoutWrapper: React.FC<ILayoutWrapperProps> = ({
  layout,
  component: Component,
  componentProps,
  title,
  ...rest
}) => {
  const Layout = layout === undefined ? (props: any) => <>{props.children}</> : layout;
  if (!!title) document.title = title;

  return (
    <Layout {...rest}>
      <Component {...componentProps} />
    </Layout>
  );
};

export default LayoutWrapper;
