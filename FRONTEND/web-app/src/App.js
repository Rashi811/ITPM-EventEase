import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from "./component/HomePage";
import EventHome from "./component/EventHome";
import AddEvent from "./component/AddEvent";
import EventSummary from "./component/EventSummary";
import EventDetails from "./component/EventDetails";
import UpdateEvent from "./component/UpdateEvent";
import Header from "./component/Header";
import Footer from "./component/Footer";
import AboutUs from "./component/AboutUs";

//Gangani
import TaskDashboard from "./component/Task/TaskDashboard";
import TaskCreateForm from "./component/Task/CreateTaskForm";
import TaskList from "./component/Task/TaskList";
import UpdateTaskForm from "./component/Task/UpdateTask";

// Lazy load components
const AdminVenue = React.lazy(() => import('./component/Venue/AdminVenue'));
const SuggestVenueForm = React.lazy(() => import('./component/Venue/SuggestVenueForm'));
const MainVenuePage = React.lazy(() => import('./component/Venue/pages/MainVenuePage'));
const BookingPage = React.lazy(() => import('./component/Venue/pages/BookingPage'));
const BookingCalendar = React.lazy(() => import('./component/Venue/BookingCalendar'));
const BookingForm = React.lazy(() => import('./component/Venue/BookingForm'));

function App() {
  return (
    <Router>
      <Header />
      <div>
        <Suspense fallback={
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100vh' 
          }}>
            Loading...
          </div>
        }>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event" element={<EventHome />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/event-summary/" element={<EventSummary />} />
            <Route path="/update-event/" element={<UpdateEvent />} />
            <Route path="/event-details/" element={<EventDetails />} />
            <Route path="/about/" element={<AboutUs />} />
            <Route path="/task-dashboard/" element={<TaskDashboard/>} />
            <Route path="/create-task/" element={<TaskCreateForm/>} />
            <Route path="/task-list/" element={<TaskList/>}/>
            <Route path="/update-task/:id" element={<UpdateTaskForm/>} />

            <Route path="/venues" element={<MainVenuePage />} />
            <Route path="/book" element={<BookingPage />} />
            <Route path="/suggest-venue" element={<SuggestVenueForm />} />
            <Route path="/booking-calendar" element={<BookingCalendar />} />
            <Route path="/booking-form" element={<BookingForm />} />
            <Route path="/admin-venue" element={<AdminVenue />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
