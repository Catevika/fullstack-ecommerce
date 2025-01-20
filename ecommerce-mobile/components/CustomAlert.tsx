import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { type LucideIcon } from 'lucide-react-native';

type CustomAlertProps = {
  icon: LucideIcon,
  iconClassName: string;
  message: string,
  buttonText1?: string,
  buttonText2?: string;
  showAlertDialog?: boolean;
  showAlertError?: boolean;
  handleClose?: () => void;
};
export const CustomAlert = ({ icon, iconClassName, message, buttonText1, buttonText2, showAlertDialog, showAlertError, handleClose }: CustomAlertProps) => {

  return (
    <AlertDialog
      isOpen={showAlertDialog ? showAlertDialog : showAlertError}
      onClose={handleClose}
      className='flex justify-center items-center p-5'
    >
      <AlertDialogBackdrop />
      <AlertDialogContent className="max-w-[649px] w-full md:flex-row mx-2">
        <AlertDialogBody
          className=""
          contentContainerClassName="flex-row"
        >
          <Box className="w-12 min-[350px]:w-14 rounded-full items-center justify-center">
            <Icon
              as={icon}
              className={iconClassName}
              size="xl"
            />
          </Box>
          {message ? <Text size="sm">{message}</Text> : null}
        </AlertDialogBody>
        <AlertDialogFooter>
          {buttonText1 ? <Button
            variant="outline"
            action="secondary"
            onPress={handleClose}
            size="sm"
          >
            <ButtonText>{buttonText1}</ButtonText>
          </Button> : null}
          {buttonText2 ? <Button size="sm" onPress={handleClose}>
            <ButtonText>{buttonText2}</ButtonText>
          </Button> : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
