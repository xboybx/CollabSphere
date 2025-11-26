import React, { useEffect, useRef } from "react";
// import { Terminal } from "xterm";
import "xterm/css/xterm.css";
import { FitAddon } from "xterm-addon-fit";

const Term = ({ terminal }) => {
  const terminalRef = useRef(null);

  useEffect(() => {
    if (terminal && terminalRef.current) {
      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);
      terminal.open(terminalRef.current);
      fitAddon.fit();
    }
  }, [terminal]);

  return <div ref={terminalRef} />;
};

export default Term;
