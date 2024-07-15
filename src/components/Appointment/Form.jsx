import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import diamond from "../../assets/images/poster.jpg";
import UICircularIndeterminate from "../UI/CircularIndeterminate";
import {
  addValuationRequest,
  getCustomer,
  getServices,
} from "../../services/api.js";

const AppointmentForm = () => {
  const { id } = useSelector((state) => state.auth.user);

  const { data: services, isLoading: isServiceLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: customer, isLoading: isCustomerLoading } = useQuery({
    queryKey: ["customer"],
    queryFn: () => getCustomer(id),
  });

  const [service, setService] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [valuationRequestId, setValuationRequestId] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (services && services.length > 0) {
      setService(services[0].name);
    }
  }, [services]);

  const validationSchema = Yup.object({
    diamondQuantity: Yup.number()
      .required("Quantity is required")
      .min(1, "Quantity must be larger than 0"),
  });

  const formik = useFormik({
    initialValues: {
      diamondQuantity: 0,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const body = {
        diamondAmount: values.diamondQuantity,
        service: {
          id: services.find((s) => s.name === service).id,
        },
        customerID: customer.id,
        staffID: 0,
      };
      mutate(body);

      const now = new Date();
      const options = {
        hour: "numeric",
        minute: "numeric",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      const appointmentTime = `${now.toLocaleTimeString(undefined, options)}`;
      setAppointmentTime(appointmentTime);
    },
  });

  const { mutate } = useMutation({
    mutationFn: (body) => {
      return addValuationRequest(body);
    },
    onSuccess: (data) => {
      setValuationRequestId(data.data.id);
      toast.success("Appointment created successfully");
      setOpen(true);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Failed to create appointment");
    },
  });

  const handleServiceChange = (event) => {
    setService(event.target.value);
  };

  const handleUpdate = () => {
    navigate("/update");
  };

  if (isServiceLoading || isCustomerLoading) {
    return <UICircularIndeterminate />;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "550px",
        bgcolor: "#717171",
        marginTop: "20px",
        marginBottom: "30px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={diamond}
        alt="Diamond"
        sx={{
          width: "100%",
          position: "absolute",
          height: "550px",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: "460px",
          height: "500px",
          left: "150px",
          bgcolor: "#d8c0989e",
          p: 3,
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontWeight: "bold",
            color: "#003565",
            mb: 3,
          }}
        >
          Appointments
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <FormControl
            sx={{
              width: "380px",
              ml: "15px",
              borderRadius: 1,
              border: "1px solid white",
              paddingLeft: "10px",
              paddingY: "5px",
              marginBottom: "7px",
            }}
          >
            <FormLabel
              sx={{
                color: "black",
                margin: "2px",
                fontWeight: "bold",
                fontSize: "17px",
                textAlign: "center",
              }}
            >
              Customer Information
            </FormLabel>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "5px",
                borderRadius: "4px",
              }}
            >
              <Box
                sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "white", margin: "2px" }}
                >
                  Name: {customer.lastName + " " + customer.firstName}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "white", margin: "2px" }}
                >
                  Identity Card: {customer.identityDocument}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "white", margin: "2px" }}
                >
                  Phone: {customer.phone}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: "white", margin: "2px" }}
                >
                  Address: {customer.address}
                </Typography>
              </Box>
              <ArrowForwardIosIcon
                onClick={handleUpdate}
                sx={{ color: "white", marginTop: "-15px" }}
                cursor="pointer"
              />
            </Box>
          </FormControl>

          <FormControl sx={{ width: "380px", ml: "15px" }}>
            <FormLabel sx={{ color: "white", margin: "2px" }}>
              Service*
            </FormLabel>
            <Select
              variant="outlined"
              required
              sx={{
                color: service === "Choose service" ? " #a9a9a9" : "black",
                height: "40px",
                backgroundColor: "white",
                fontFamily: "'Your Font Family', sans-serif",
              }}
              value={service}
              onChange={handleServiceChange}
            >
              <MenuItem value="" disabled>
                Choose service
              </MenuItem>
              {services.map((service, index) => (
                <MenuItem key={index} value={service.name}>
                  {service.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ width: "380px", ml: "15px" }}>
            <FormLabel sx={{ color: "white", margin: "2px" }}>
              Quantity*
            </FormLabel>
            <TextField
              type="number"
              variant="outlined"
              required
              placeholder="Input quantity"
              name="diamondQuantity"
              value={formik.values.diamondQuantity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.diamondQuantity &&
                Boolean(formik.errors.diamondQuantity)
              }
              helperText={
                formik.touched.diamondQuantity && formik.errors.diamondQuantity
              }
              InputProps={{
                sx: {
                  height: "40px",
                  backgroundColor: "white",
                },
              }}
              inputProps={{
                min: 0,
              }}
            />
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, width: "380px", ml: "15px" }}
          >
            Submit
          </Button>
        </form>

        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Box display="flex" justifyContent="center" alignItems="center">
              <CheckCircleOutlineIcon
                color="success"
                style={{ fontSize: 70 }}
              />
            </Box>
          </DialogTitle>
          <DialogContent dividers>
            <Typography variant="h6" align="center">
              The appointment was successfully created at {appointmentTime}.
            </Typography>
            <Typography variant="body1" align="center">
              Your appointment ID is {valuationRequestId}.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              color="primary"
              autoFocus
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
};

export default AppointmentForm;
