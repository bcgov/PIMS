import React from 'react';

interface ILayoutWrapperProps {
  layout?: React.ComponentType<any>;
  component: React.ComponentType<any>;
  componentProps?: any;
  title?: string;
  bannerText?: string;
}

export const LayoutWrapper: React.FC<ILayoutWrapperProps> = ({
  layout,
  component: Component,
  componentProps,
  title,
  bannerText,
  ...rest
}) => {
  const Layout = layout === undefined ? (props: any) => <>{props.children}</> : layout;
  if (!!title) document.title = title;

  return (
    <Layout {...rest}>
      {bannerText ? (
        <div
          style={{
            zIndex: 100,
            backgroundColor: 'magenta',
            padding: '1em 15%',
            maxHeight: '90px',
          }}
        >
          {bannerText}
        </div>
      ) : (
        <></>
      )}
      <Component {...componentProps} />
    </Layout>
  );
};

export default LayoutWrapper;
