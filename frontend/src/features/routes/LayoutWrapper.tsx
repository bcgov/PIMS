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
      {/* Banner used for PIMS update event */}
      {bannerText ? (
        <div
          style={{
            zIndex: 100,
            backgroundColor: 'magenta',
            padding: '1em 0',
          }}
        >
          {bannerText.split('\n').map((line, i) => (
            <p
              key={i}
              style={{
                margin: 0,
              }}
            >
              {line}
            </p>
          ))}
        </div>
      ) : (
        <></>
      )}
      <Component {...componentProps} />
    </Layout>
  );
};

export default LayoutWrapper;
