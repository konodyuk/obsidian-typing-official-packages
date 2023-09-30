import { useState, useContext, createContext, useEffect } from "react";
import styled from "@emotion/styled";

const StyledTable = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: content-box;

  & * {
    box-sizing: content-box;
  }
`;

export const TableContext = createContext({
  state: {},
  setIsSectionOpen: () => {},
});

const TableProvider = ({ children, ...rest }) => {
  const [state, setState] = useState({});
  const setIsSectionOpen = (sectionName, value) => {
    setState((prevState) => ({ ...prevState, [sectionName]: value }));
  };

  return (
    <TableContext.Provider value={{ state, setIsSectionOpen }}>
      <StyledTable {...rest}>{children}</StyledTable>
    </TableContext.Provider>
  );
};

const StyledRow = styled.div`
  display: flex;
  flex-direction: row;
  &:hover {
    box-shadow: inset 0px 100px #fff1;
  }
`;

const TableRow = (props) => <StyledRow {...props} />;

const TableCell = styled.div`
  padding: 0.5em;
  height: 1em;
  flex-grow: 0;
  flex-shrink: ${(props) => (props.long ? 1 : 0)};
  text-overflow: ellipsis;
  text-align: left;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: ${(props) => (props.size ? `${props.size}ch` : "unset")};

  @media (max-width: 450px) {
    display: ${(props) => (props.optional ? "none" : "inherit")};
  }
`;

const Pill = styled.span`
  font-size: 0.8em;
  padding: 0.1em 0.2em;
  border-radius: 1em;
  color: var(--text-muted);
  border: 1px solid var(--background-modifier-border);
  margin: 0em 0.5em;
  white-space: nowrap;

  @media (max-width: 450px) {
    display: ${(props) => (props.optional ? "none" : "inherit")};
  }
`;

const IconContainer = styled.div`
  max-width: 1em;
  max-height: 1em;
  font-size: 0.9em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = ({ icons, className }) => (
  <IconContainer>
    <span className={className}>
      {icons?.map((icon) => (
        <i className={icon} key={icon}></i>
      ))}
    </span>
  </IconContainer>
);

const SectionHeaderContainer = styled.div`
  background-color: var(--background-secondary);
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0.5em;
  height: 1em;
  &:hover {
    box-shadow: inset 0px 100px #fff1;
  }
`;

const TableSection = (props) => {
  const context = useContext(TableContext);
  const isOpen = context.state[props.title] ?? false;
  const toggleOpen = () => context.setIsSectionOpen(props.title, !isOpen);

  useEffect(() => {
    context.setIsSectionOpen(props.title, props.open ?? false);
  }, [props.open, props.title, context]);

  return (
    <>
      <SectionHeaderContainer onClick={toggleOpen}>
        <TableCell>{props.icon}</TableCell>
        <span>{props.title}</span>
        {props.childrenCallback && props.childrenCallback(props.children)}
        <TableCell
          onClick={(e) => {
            e.stopPropagation();
            props.onNew();
          }}
        >
          <Icon className="far fa-plus" />
        </TableCell>
      </SectionHeaderContainer>
      {isOpen && props.children}
    </>
  );
};

export const Table = {
  Root: TableProvider,
  Row: TableRow,
  Cell: TableCell,
  Section: TableSection,
  Icon,
  Pill,
  Context: TableContext,
};
