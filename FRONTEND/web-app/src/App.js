import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./component/HomePage";
import EventHome from "./component/EventHome";
import AddEvent from "./component/AddEvent";
import EventSummary from "./component/EventSummary";
import EventDetails from "./component/EventDetails";
import UpdateEvent from "./component/UpdateEvent";
import Header from "./component/Header";
import Footer from "./component/Footer";
import AboutUs from "./component/AboutUs";
import AddReport from "./component/AddReport";
import AllReports from "./component/AllReports";
import SignUp from './component/SignUp';
import Login from './component/Login';
import AdminDashboard from './component/AdminDashboard';

// Ruvindya
import MainVenuePage from "./component/Venue/pages/MainVenuePage";
import BookingPage from "./component/Venue/pages/BookingPage";
import SuggestVenueForm from "./component/Venue/SuggestVenueForm";
import BookingCalendar from "./component/Venue/BookingCalendar";
import BookingForm from "./component/Venue/BookingForm";
import AdminVenue from "./component/Venue/AdminVenue";

// Gangani
import TaskDashboard from "./component/Task/TaskDashboard";
import TaskCreateForm from "./component/Task/CreateTaskForm";
import TaskList from "./component/Task/TaskList";
import UpdateTaskForm from "./component/Task/UpdateTask";



function App() {
  return (
    <BrowserRouter>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event" element={<EventHome />} />
          <Route path="/add-event" element={<AddEvent />} />
          <Route path="/event-summary" element={<EventSummary />} />
          <Route path="/update-event" element={<UpdateEvent />} />
          <Route path="/event-details" element={<EventDetails />} />
          <Route path="/add-report" element={<AddReport />} />
          <Route path="/all-reports" element={<AllReports />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/signUp" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/" element={<Login />} />
          

          <Route path="/task-dashboard" element={<TaskDashboard />} />
          <Route path="/create-task" element={<TaskCreateForm />} />
          <Route path="/task-list" element={<TaskList />} />
          <Route path="/update-task/:id" element={<UpdateTaskForm />} />
          
          <Route path="/venues" element={<MainVenuePage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/suggest-venue" element={<SuggestVenueForm />} />
          <Route path="/booking-calendar" element={<BookingCalendar />} />
          <Route path="/booking-form" element={<BookingForm />} />
          <Route path="/admin-venue" element={<AdminVenue />} />


        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
