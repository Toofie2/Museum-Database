import TicketInfo from "../components/TicketInfo.jsx"
import TicketForm from "../components/TicketForm.jsx"
import NavbarBlack from "../components/NavbarBlack.jsx";

const TicketPage = () => {
  return (
    <div>
      <NavbarBlack/>
      <div className="container mx-auto pb-12 p-1">
        <div className="mt-28 flex justify-between px-16 space-x-24">
          <div>
            <TicketInfo />
          </div>
          <div>
            <TicketForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketPage;

//relative min-h-screen p-1