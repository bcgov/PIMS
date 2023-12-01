import { fireEvent, render, waitFor } from '@testing-library/react';
import MapDropPin from 'features/mapSideBar/components/MapDropPin';
import React from 'react';

describe('MapDropPin', () => {
  it('should set moving pin namespace when MapDropPin is clicked', () => {
    // Arrange
    const setMovingPinNameSpace = jest.fn();
    const nameSpace = 'testNamespace';
    const isBuilding = true;
    const onPinDrop = jest.fn();
    const resetNamespace = true;
    const disabled = false;

    // Act
    const { container } = render(
      <MapDropPin
        setMovingPinNameSpace={setMovingPinNameSpace}
        nameSpace={nameSpace}
        isBuilding={isBuilding}
        onPinDrop={onPinDrop}
        resetNamespace={resetNamespace}
        disabled={disabled}
      />,
    );
    const button = container.querySelector('#draft-marker-button');
    waitFor(() => {
      fireEvent.click(button!);
    });

    // Assert
    expect(setMovingPinNameSpace).toHaveBeenCalledWith(nameSpace);
    expect(button!.attributes.getNamedItem('disabled')).toBe(null); // AKA not disabled
    expect(setMovingPinNameSpace).toHaveBeenCalledTimes(1);
    expect(setMovingPinNameSpace).toHaveBeenCalledWith(nameSpace);
  });

  // TODO: Can't get this text to activate the clickaway function...
  // Clicking away from the location pin deactivates it and resets the moving pin namespace if resetNamespace is true
  xit('should deactivate location pin and reset moving pin namespace when clicked away from the pin', () => {
    // Arrange
    const setMovingPinNameSpace = jest.fn();
    const nameSpace = 'testNamespace';
    const isBuilding = true;
    const onPinDrop = jest.fn();
    const resetNamespace = true;
    const disabled = false;

    // Act
    const { container, getByText } = render(
      <div id="outside clickaway">
        <h1>click here!</h1>
        <MapDropPin
          setMovingPinNameSpace={setMovingPinNameSpace}
          nameSpace={nameSpace}
          isBuilding={isBuilding}
          onPinDrop={onPinDrop}
          resetNamespace={resetNamespace}
          disabled={disabled}
        />
      </div>,
    );
    // Click pin
    const button = container.querySelector('#draft-marker-button');
    waitFor(() => {
      fireEvent.click(button!);
    });
    // Click outside of pin
    waitFor(() => {
      fireEvent.click(getByText(/click here/));
    });

    // Assert
    expect(onPinDrop).toHaveBeenCalled();
    expect(setMovingPinNameSpace).toHaveBeenCalledWith(nameSpace);
    expect(setMovingPinNameSpace).toHaveBeenCalledWith(undefined);
    expect(setMovingPinNameSpace).toHaveBeenCalledTimes(2);
  });
});
