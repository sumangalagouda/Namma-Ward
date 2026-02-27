import { useState } from "react";
import api from "../api/axios";
import {
  Search,
  CreditCard,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Receipt,
  Calendar,
  DollarSign,
  FileText,
  Sparkles,
  ArrowRight,
  Download,
  RefreshCw,
  X,
  Wallet,
  Smartphone,
  Building2,
  Shield
} from "lucide-react";
import logoImg from "../assets/LOGO1.png";

export default function BillPayment() {
  const [billNumber, setBillNumber] = useState("");
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const lookup = async (e) => {
    e && e.preventDefault();
    setError("");
    setSuccess("");
    setBill(null);
    
    if (!billNumber.trim()) {
      setError("Please enter a bill number");
      return;
    }

    setLoading(true);
    try {
      const res = await api.get(`/citizens/bill/${billNumber}`);
      setBill(res.data);
    } catch (err) {
      const serverMsg = err.response?.data?.error || err.response?.data?.message || err.response?.data?.msg;
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(serverMsg || 'Authentication required. Please login to lookup bills.');
      } else if (serverMsg) {
        setError(serverMsg);
      } else {
        setError('Unable to find bill. Please check the bill number.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load external script helper
  const loadScript = (src) =>
    new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const pay = async () => {
    // Use Razorpay Checkout flow
    if (!bill) return;
    setPaying(true);
    setError("");
    setSuccess("");

    // load Razorpay script
    const ok = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!ok) {
      setError('Failed to load payment gateway.');
      setPaying(false);
      return;
    }

    try {
      // create order on server
      const res = await api.post('/citizens/bill/create_order', { bill_number: bill.bill_number });
      const { order_id, key, amount } = res.data;

      const options = {
        key: key,
        amount: amount,
        currency: 'INR',
        name: 'Municipal Payments',
        description: `Payment for bill ${bill.bill_number}`,
        order_id: order_id,
        handler: async function(response) {
          // response contains razorpay_payment_id, razorpay_order_id, razorpay_signature
          try {
            await api.post('/citizens/bill/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              bill_number: bill.bill_number
            });

            setSuccess('🎉 Payment completed successfully!');
            setBill({ ...bill, status: 'paid', paid_at: new Date().toISOString() });
            setShowPaymentModal(false);
          } catch (err) {
            setError(err.response?.data?.error || 'Payment verification failed');
          }
        },
        prefill: {
          // Optionally prefill user email/phone
        },
        notes: {
          bill_number: bill.bill_number
        },
        theme: { color: '#10b981' }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.error || 'Payment initiation failed');
    } finally {
      setPaying(false);
    }
  };

  const paymentMethods = [
    { id: "card", label: "Credit/Debit Card", icon: <CreditCard size={20} /> },
    { id: "upi", label: "UPI Payment", icon: <Smartphone size={20} /> },
    { id: "wallet", label: "Digital Wallet", icon: <Wallet size={20} /> },
    { id: "netbanking", label: "Net Banking", icon: <Building2 size={20} /> },
  ];

  const reset = () => {
    setBillNumber("");
    setBill(null);
    setError("");
    setSuccess("");
  };

  const downloadReceipt = async () => {
    if (!bill) return;
    const p = bill.payment || {};

    // try to load jsPDF from CDN
    const ok = await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
    if (ok && window.jspdf && window.jspdf.jsPDF) {
      try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF({ unit: 'mm', format: 'a4' });

        // helper to load image
        const loadImageElement = (src) => new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

        const imgEl = await loadImageElement(logoImg).catch(() => null);
        // Header
        if (imgEl) {
          doc.addImage(imgEl, 'PNG', 14, 12, 28, 28);
        }
        doc.setFontSize(18);
        doc.text('Municipal Corporation', 48, 18);
        doc.setFontSize(11);
        doc.text('Payment Receipt', 48, 26);

        // receipt/meta box
        const rightX = 155;
        doc.setDrawColor(200);
        doc.rect(rightX - 2, 10, 46, 28);
        doc.setFontSize(10);
        const receiptId = p.razorpay_payment_id || `RCPT-${bill.bill_number}`;
        doc.text(`Receipt: ${receiptId}`, rightX, 16);
        doc.text(`Date: ${new Date().toLocaleString('en-IN')}`, rightX, 22);

        // payer and bill info
        let y = 48;
        doc.setFontSize(11);
        doc.text(`Bill Number: ${bill.bill_number}`, 14, y);
        doc.text(`Bill Type: ${bill.bill_type}`, 14, y + 7);
        doc.text(`Amount Paid: ₹${p.amount || bill.amount_due}`, 14, y + 14);
        if (p.payer_name) doc.text(`Paid By: ${p.payer_name}`, 14, y + 21);
        if (p.payer_email) doc.text(`Payer Email: ${p.payer_email}`, 14, y + 28);

        // simple table for amounts
        const tableY = y + 40;
        doc.setFontSize(10);
        doc.setFillColor(240);
        doc.rect(14, tableY - 6, 178, 10, 'F');
        doc.text('Description', 16, tableY);
        doc.text('Amount (₹)', 170, tableY, { align: 'right' });

        // single line - total
        doc.setFontSize(11);
        doc.text('Total Amount Paid', 16, tableY + 12);
        doc.text(`₹${p.amount || bill.amount_due}`, 170, tableY + 12, { align: 'right' });

        // footer / signature
        doc.setFontSize(10);
        doc.text('This is a computer generated receipt.', 14, 260);
        doc.text('Authorized Signatory', 150, 260);

        doc.save(`receipt-${bill.bill_number}.pdf`);
        return;
      } catch (e) {
        // fallthrough to text fallback
      }
    }

    // fallback to text file
    const lines = [];
    lines.push('Municipal Payment Receipt');
    lines.push('-------------------------');
    lines.push(`Bill Number: ${bill.bill_number}`);
    lines.push(`Bill Type: ${bill.bill_type}`);
    lines.push(`Amount Paid: ₹${p.amount || bill.amount_due}`);
    lines.push(`Paid At: ${p.paid_at || bill.paid_at || new Date().toISOString()}`);
    if (p.payer_name) lines.push(`Paid By: ${p.payer_name}`);
    if (p.payer_email) lines.push(`Payer Email: ${p.payer_email}`);
    if (p.razorpay_payment_id) lines.push(`Payment ID: ${p.razorpay_payment_id}`);
    if (p.razorpay_order_id) lines.push(`Order ID: ${p.razorpay_order_id}`);
    lines.push('Thank you for your payment.');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${bill.bill_number}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6 md:p-8">
      
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Receipt className="text-emerald-600" size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">Bill Payment Portal</h1>
              <p className="text-emerald-100 text-lg">Pay your municipal bills quickly and securely</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Search className="text-emerald-600" size={24} />
            Find Your Bill
          </h3>

          <form onSubmit={lookup} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Bill Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                  placeholder="Enter your bill number (e.g., BILL123456)"
                  className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                  disabled={loading}
                />
                {billNumber && (
                  <button
                    type="button"
                    onClick={reset}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !billNumber.trim()}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search size={20} />
                    Search Bill
                  </>
                )}
              </button>
              {bill && (
                <button
                  type="button"
                  onClick={reset}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  New Search
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6 animate-in slide-in-from-top">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 rounded-xl p-4 mb-6 animate-in slide-in-from-top">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-green-800 font-medium">Success!</p>
                <p className="text-green-700 text-sm">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Bill Details Card */}
        {bill && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden animate-in zoom-in">
            
            {/* Bill Header */}
            <div className={`p-6 ${
              bill.status === 'paid' 
                ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200' 
                : 'bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">Bill Details</h3>
                  <p className="text-gray-600">#{bill.bill_number}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${
                  bill.status === 'paid' 
                    ? 'bg-green-500 text-white' 
                    : 'bg-orange-500 text-white'
                }`}>
                  {bill.status === 'paid' ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={16} />
                      PAID
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <AlertCircle size={16} />
                      UNPAID
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bill Info */}
            <div className="p-6 space-y-4">
              
              {/* Bill Type */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Bill Type</p>
                    <p className="font-bold text-gray-800">{bill.bill_type}</p>
                  </div>
                </div>
              </div>

              {/* Amount Due */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="text-white" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount Due</p>
                    <p className="font-bold text-3xl text-emerald-700">₹{bill.amount_due}</p>
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-orange-600" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Due Date</p>
                    <p className="font-bold text-gray-800">
                      {bill.due_date ? new Date(bill.due_date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Paid At (if paid) */}
              {bill.status === 'paid' && bill.paid_at && (
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Paid On</p>
                      <p className="font-bold text-gray-800">
                        {new Date(bill.paid_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      {bill.payment?.payer_name && (
                        <p className="text-sm text-gray-700 mt-1">Paid By: {bill.payment.payer_name}{bill.payment.payer_email ? ` (${bill.payment.payer_email})` : ''}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              {bill.status !== 'paid' ? (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
                  >
                    <CreditCard size={24} />
                    Proceed to Payment
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center mb-3">
                    <Sparkles className="mx-auto text-green-600 mb-2" size={32} />
                    <p className="text-green-800 font-semibold">This bill has been paid!</p>
                    <p className="text-green-600 text-sm">Thank you for your payment</p>
                  </div>
                  <button
                    onClick={downloadReceipt}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    Download Receipt
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-in zoom-in">
              
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-bold">Complete Payment</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-1 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>
                <p className="text-emerald-100">Select your preferred payment method</p>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-2 border-emerald-200 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
                    <p className="text-3xl font-bold text-emerald-700">₹{bill?.amount_due}</p>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="space-y-3 mb-6">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Choose Payment Method</p>
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                        paymentMethod === method.id
                          ? 'border-emerald-500 bg-emerald-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        paymentMethod === method.id ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {method.icon}
                      </div>
                      <span className="font-semibold text-gray-800">{method.label}</span>
                      {paymentMethod === method.id && (
                        <CheckCircle2 className="ml-auto text-emerald-500" size={20} />
                      )}
                    </button>
                  ))}
                </div>

                {/* Security Badge */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 mb-4">
                  <Shield size={14} className="text-emerald-600" />
                  <span>Secured with 256-bit encryption</span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={pay}
                    disabled={paying}
                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl font-bold hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CreditCard size={20} />
                        Pay Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}