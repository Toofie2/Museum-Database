import TicketInfo from "../components/TicketInfo.jsx"
import TicketForm from "../components/TicketForm.jsx"
import NavbarBlack from "../components/NavbarBlack.jsx";
import Footer from "../components/Footer.jsx";

const TicketPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarBlack/>
      <div className="container mx-auto pb-12 p-1 flex-grow">
        <div className="mt-28 flex justify-between px-16 space-x-24">
          <div>
            <TicketInfo />
          </div>
          <div>
            <TicketForm />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TicketPage;

//relative min-h-screen p-1