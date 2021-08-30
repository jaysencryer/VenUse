const VenueAddress = ({ className, address }) => (
    <section className={className}>
        <span>{address.street1}</span>
        <span>{address.street2}</span>
        <span>{address.city}</span>
        <span>{address.state}</span>
        <span>{address.country}</span>
        <span>{address.zip}</span>
    </section>
);

export default VenueAddress;
