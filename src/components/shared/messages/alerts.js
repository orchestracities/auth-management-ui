import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

//default, success, error, warning , info
const useNotification = () => {
  const [conf, setConf] = useState({});
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (conf?.msg) {
      let variant = 'info';
      if (conf.variant) {
        variant = conf.variant;
      }
      enqueueSnackbar(conf.msg, {
        variant: variant,
        autoHideDuration: 5000
      });
    }
  }, [conf]);
  return [conf, setConf];
};

export default useNotification;
