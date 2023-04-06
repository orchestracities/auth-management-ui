import * as React from 'react';
import { styled } from '@mui/system';
import Grid from '@mui/material/Grid';
import { RgbaColorPicker } from 'react-colorful';
import { colord, extend, getFormat } from 'colord';
import namesPlugin from 'colord/plugins/names';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

extend([namesPlugin]);

const grey = {
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7',
  400: '#B2BAC2',
  500: '#A0AAB4',
  600: '#6F7E8C',
  700: '#3E5060',
  800: '#2D3843',
  900: '#1A2027'
};

const Root = styled('div')`
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  position: relative;
  display: inline-block;
  vertical-align: baseline;
  color: #000;
  margin-top: 50px;
`;

const ColorString = styled(TextField)({
  marginTop: 15,
  width: '80%'
});

const Toggle = styled('div')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  min-height: calc(1.5em + 30px);
  min-width: 300px;
  background: var(--color, ${theme.palette.mode === 'dark' ? grey[900] : '#fff'});
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
  box-shadow: ${theme.palette.mode === 'dark' ? '0 5px 13px -3px rgba(0,0,0,0.4)' : `0 5px 13px -3px ${grey[200]}`};
  border-radius: 0.75em;
  margin: 0.5em;
  padding: 10px;
  text-align: left;
  line-height: 1.5;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: default;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;

  & .placeholder {
    opacity: 0.8;
    color:${theme.palette.primary.contrastText}
  }
  `
);

const Listbox = styled('ul')(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  min-height: 320px;
  box-sizing: border-box;
  padding: 5px;
  margin: 5px 0 0 0;
  list-style: none;
  position: absolute;
  height: auto;
  transition: opacity 0.1s ease;
  width: 100%;
  box-shadow: ${theme.palette.mode === 'dark' ? '0 5px 13px -3px rgba(0,0,0,0.4)' : `0 5px 13px -3px ${grey[200]}`};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
  border-radius: 0.75em;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  overflow: auto;
  z-index: 1;
  outline: 0px;

  &.hidden {
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s 0.5s ease, visibility 0.4s 0.5s step-end;
  }

  & > li {
    padding: 8px;
    border-radius: 0.45em;

    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    }

    &[aria-selected='true'] {
      background: ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    }
  }
  `
);

function CustomSelect({ placeholder, defaultValue, mode, setColor }) {
  const listboxRef = React.useRef(null);
  const [listboxVisible, setListboxVisible] = React.useState(false);
  const [color, setTheColor] = React.useState(mode === 'modify' ? defaultValue : '#8086ba');
  const [notValid, setValidity] = React.useState(false);

  const colorValidityCheck = (newColor) => {
    const type = getFormat(newColor);
    if (typeof type === 'undefined') {
      setValidity(true);
    } else {
      setValidity(false);
      setTheColor(colord(newColor).toHex());
    }
  };

  React.useEffect(() => {
    if (listboxVisible) {
      listboxRef.current?.focus();
      setColor(color);
      setValidity(false);
    }
  }, [listboxVisible, color]);

  return (
    <Root
      onMouseOver={() => setListboxVisible(true)}
      onMouseOut={() => setListboxVisible(false)}
      onFocus={() => setListboxVisible(true)}
      onBlur={() => setListboxVisible(false)}
    >
      <Toggle style={{ '--color': color }}>
        <span className="placeholder">{placeholder ?? ' '}</span>
        <span className="placeholder">{colord(color).toName({ closest: true }) ?? ' '}</span>
      </Toggle>
      <Listbox className={listboxVisible ? '' : 'hidden'}>
        <Grid item xs={12} container direction="column" justifyContent="space-between" alignItems="center">
          <Box
            sx={{
              marginTop: 2
            }}
          >
            <RgbaColorPicker color={colord(color).toRgb()} onChange={(color) => setTheColor(colord(color).toHex())} />
          </Box>
          <ColorString
            id="outlined-basic"
            variant="outlined"
            defaultValue={colord(color).toRgbString()}
            value={colord(color).toRgbString()}
            onChange={(event) => {
              colorValidityCheck(event.target.value);
            }}
            helperText={notValid ? 'the entry is not valid' : ''}
            error={notValid}
          />
        </Grid>
      </Listbox>
    </Root>
  );
}

export default function ColorPicker({ defaultValue, mode, setColor, text }) {
  return <CustomSelect placeholder={text} defaultValue={defaultValue} setColor={setColor} mode={mode} />;
}
