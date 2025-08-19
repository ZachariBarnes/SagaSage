import * as React from 'react';
import PropTypes from "prop-types";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import "./DialogStyles.css";


const EditDialog = ({ buttonText, fieldName, formField, setField, showWarning, warningText }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button className="dialog-button" onClick={handleClickOpen}>
        {buttonText}
      </button>
      <Dialog
        open={open}
        fullWidth
        maxWidth='md'
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData).entries());
            const newValue = formJson[fieldName];
            setField(newValue)
            handleClose();
          },
        }}
      >
        <DialogTitle>Edit {fieldName}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please update the following field with the desired value
          </DialogContentText>
          <TextField
            autoFocus
            required
            InputProps={{
              style: { minWidth: `50vw`, paddingLeft: '10px' },
            }}
            margin="normal"
            id={fieldName}
            name={fieldName}
            fullWidth
            multiline
            variant="outlined"
            defaultValue={formField}
          />
          {showWarning ? (
            <DialogContentText>
              <div className='warning'>
                <WarningAmberIcon /> {warningText} <WarningAmberIcon />
              </div>
            </DialogContentText>
          ) : ''}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Save</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

EditDialog.propTypes = {
  buttonText: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  formField: PropTypes.string,
  setField: PropTypes.func.isRequired,
  showWarning: PropTypes.bool,
  warningText: PropTypes.string,
};

export default EditDialog;