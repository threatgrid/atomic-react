import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef
} from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

import AAppContext from "../AApp/AAppContext";
import {useCombinedRefs} from "../../utils/hooks";
import {keyCodes} from "../../utils/helpers";
import "./ADialog.scss";

let launcherElement = null;

const ADialog = forwardRef(
  (
    {
      children,
      className: propsClassName,
      onClickOutside,
      onClick,
      open,
      ...rest
    },
    ref
  ) => {
    useEffect(() => {
      if (open) {
        launcherElement = document.activeElement;
      } else {
        launcherElement && launcherElement.focus();
      }
    }, [open]);

    const {appRef} = useContext(AAppContext);

    const dialogRef = useRef(null);
    const combinedRef = useCombinedRefs(ref, dialogRef);

    useEffect(() => {
      if (open) {
        combinedRef &&
          combinedRef.current &&
          combinedRef.current.focus({
            preventScroll: true
          });
      }
    }, [open, combinedRef]);

    const keyDownEscHandler = useCallback(
      (e) => {
        if (e.keyCode === keyCodes.esc) {
          onClickOutside();
        }
      },
      [onClickOutside]
    );

    useEffect(() => {
      const mountEl = appRef.current;
      if (!mountEl) return;
      mountEl.addEventListener("keydown", keyDownEscHandler);

      return () => {
        mountEl.removeEventListener("keydown", keyDownEscHandler);
      };
    }, [keyDownEscHandler, appRef]);

    let backdropClassName = "a-dialog-backdrop";
    let className = "a-dialog";
    if (open) {
      backdropClassName += " a-dialog-backdrop--active";
      className += " a-dialog--active";
    }

    if (propsClassName) {
      className += ` ${propsClassName}`;
    }

    const onClickHandler = (e) => {
      if (onClickOutside && e.currentTarget === e.target) {
        onClickOutside(e);
      }

      onClick && onClick(e);
    };

    return (
      open &&
      appRef.current &&
      ReactDOM.createPortal(
        <>
          <div className={backdropClassName} />
          <div
            {...rest}
            role="document"
            tabIndex={0}
            ref={combinedRef}
            className={className}
            onClick={onClickHandler}>
            {children}
          </div>
        </>,
        appRef.current
      )
    );
  }
);

ADialog.propTypes = {
  /**
   * Handles the `click` event on the backdrop.
   */
  onClickOutside: PropTypes.func,
  /**
   * Toggles the `open` state.
   */
  open: PropTypes.bool
};

ADialog.displayName = "ADialog";

export default ADialog;
