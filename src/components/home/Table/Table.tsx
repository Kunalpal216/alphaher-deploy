import React from "react";
import TableHeader from "./TableHeader";
import TableContent from "./TableContent";

const Table = () => {
  return (
    <div className="flex flex-col items-center ">
      <TableHeader />
      <TableContent />
    </div>
  );
};

export default Table;
