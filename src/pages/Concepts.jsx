import React from 'react';
import { CppMasteryWorkspace } from './CppMasteryWorkspace.jsx';

export default function Concepts({ userXp, onGainXp }) {
  return <CppMasteryWorkspace userXp={userXp} onGainXp={onGainXp} />;
}
