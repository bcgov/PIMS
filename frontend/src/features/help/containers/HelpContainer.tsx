import * as React from 'react';
import { Nav } from 'react-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';
import { useState, useCallback } from 'react';
import HelpModal from '../components/HelpModal';
import useKeycloakWrapper from 'hooks/useKeycloakWrapper';
import TooltipWrapper from 'components/common/TooltipWrapper';

/**
 * A help icon that displays the Help Modal when clicked. Does not display unless the user is authenticated.
 * @param props
 */
export function HelpContainer() {
  const [showHelp, setShowHelp] = useState(false);
  const keycloak = useKeycloakWrapper();

  const handleCancel = useCallback(() => setShowHelp(false), []);

  return keycloak.obj.authenticated ? (
    <Nav.Item>
      <TooltipWrapper toolTipId="help-tooltip" toolTip="Ask for Help">
        <FaQuestionCircle
          style={{ cursor: 'pointer', color: '#fff', marginLeft: -145 }}
          onClick={() => setShowHelp(true)}
        />
      </TooltipWrapper>
      <HelpModal
        show={showHelp}
        handleCancel={handleCancel}
        handleSubmit={handleCancel}
      ></HelpModal>
    </Nav.Item>
  ) : null;
}

export default HelpContainer;
