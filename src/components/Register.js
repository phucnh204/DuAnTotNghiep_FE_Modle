import React, { useState, useRef, useEffect } from 'react';
import { BiLogoFacebookSquare } from 'react-icons/bi';
import { IoLogoGoogleplus } from 'react-icons/io';
import Modal from 'react-modal';

// Thiết lập Modal
Modal.setAppElement('#root');

function RegisterForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassWord, setConfirmPassWord] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill(''));
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState(120); // Đếm ngược 120 giây
    const [otpError, setOtpError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [phoneError, setPhoneError] = useState('');

    // Tham chiếu cho đầu vào OTP để quản lý focus
    const otpInputRefs = useRef([]);

    // Hàm xử lý thay đổi đầu vào OTP
    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return; // Chỉ cho phép số
        const otpCopy = [...otp];
        otpCopy[index] = element.value;
        setOtp(otpCopy);

        // Di chuyển focus đến trường đầu vào tiếp theo nếu trường hiện tại đã được điền
        if (element.value !== '' && index < otpInputRefs.current.length - 1) {
            otpInputRefs.current[index + 1].focus();
        }
    };

    // Xử lý khi nhấn phím Backspace
    const handleOtpKeyDown = (e, index) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            otpInputRefs.current[index - 1].focus();
        }
    };

    // Kiểm tra định dạng số điện thoại
    const isPhoneValid = (phone) => {
        const phoneRegex = /^\d{10}$/; // Định dạng số điện thoại 10 chữ số
        return phoneRegex.test(phone);
    };

    // Xử lý khi nhấn "Đăng ký"
    const handleSubmit = (e) => {
        e.preventDefault();

        // Kiểm tra xem tên người dùng đã tồn tại chưa

        // Kiểm tra định dạng số điện thoại
        if (!isPhoneValid(phone)) {
            setPhoneError('Số điện thoại không hợp lệ. Vui lòng nhập lại.');
            return;
        } else {
            setPhoneError(''); // Reset thông báo lỗi
        }

        // Hiển thị modal OTP
        setIsModalOpen(true);
    };

    // Xử lý khi nhập mã OTP
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        // Kiểm tra mã OTP
        if (otpCode !== '123456') {
            setOtpError('Mã OTP không chính xác. Vui lòng kiểm tra lại.');
            return;
        }

        // Xử lý logic sau khi xác nhận OTP
        console.log('OTP: ', otpCode);
        console.log('Tài khoản: ', username);
        console.log('Mật khẩu: ', password);
        console.log('Số điện thoại: ', phone);
        setOtpError(''); // Reset thông báo lỗi
        setIsModalOpen(false); // Đóng modal
    };

    // Đếm ngược thời gian 120 giây
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1);
            }, 1000);
            return () => clearInterval(timer); // Clear interval khi component unmount
        }
    }, [timeLeft]);

    // Hàm gửi lại OTP
    const handleResendOtp = () => {
        setOtp(new Array(6).fill('')); // Reset OTP
        setTimeLeft(120); // Đặt lại thời gian đếm ngược

        console.log('Resend OTP');
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden">
                {/* Form đăng ký */}
                <div className="w-full md:w-1/2 p-8 bg-gradient-to-br from-white to-blue-50 shadow-inner">
                    <h2 className="text-3xl md:text-4xl mb-6 font-bold text-center text-gray-800">Đăng ký</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Tài khoản"
                        />
                        {usernameError && <p className="text-red-500 text-sm">{usernameError}</p>}
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Mật khẩu"
                        />
                        <input
                            type="password"
                            id="confirmPassWord"
                            name="confirmPassWord"
                            value={confirmPassWord}
                            onChange={(e) => setConfirmPassWord(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Nhập lại mật khẩu"
                        />
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            placeholder="Số điện thoại"
                        />
                        {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}

                        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                            <span>Bạn đã có tài khoản?</span>
                            <a href="/login" className="text-blue-500 hover:underline">
                                Đăng nhập
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow-md transform hover:scale-105"
                        >
                            Đăng ký
                        </button>
                    </form>

                    <div className="text-center text-gray-500 mt-6">hoặc</div>
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            type="button"
                            className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition duration-300 shadow-lg transform hover:scale-110"
                        >
                            <BiLogoFacebookSquare size="24" />
                        </button>
                        <button
                            type="button"
                            className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition duration-300 shadow-lg transform hover:scale-110"
                        >
                            <IoLogoGoogleplus size="24" />
                        </button>
                    </div>
                </div>

                {/* Phần bên phải có hình ảnh */}
                <div className="w-full md:w-1/2 relative flex items-center justify-center p-8 overflow-hidden bg-gradient-to-r from-blue-100 to-blue-500">
                    <div className="text-center text-white space-y-6">
                        <h3 className="text-2xl md:text-3xl font-bold">
                            Chào mừng bạn đến với <span className="text-yellow-400">Model World</span>
                        </h3>
                        <p className="text-sm md:text-lg font-light">
                            Hãy tham gia ngay để khám phá thế giới với rất nhiều mô hình. Trải nghiệm mua sắm dễ dàng, gợi ý cá nhân hóa, và
                            một cộng đồng hỗ trợ.
                        </p>
                        <img
                            src="https://vitadu.edu.vn/wp-content/uploads/2018/03/%C4%90%C4%83ng-k%C3%BD-ngay.png"
                            alt="Hình ảnh chào mừng"
                            className="rounded-lg shadow-lg w-full h-auto max-w-xs mx-auto transform hover:scale-105 transition duration-300"
                        />
                    </div>
                </div>
            </div>

            {/* Modal nhập OTP */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Xác nhận OTP"
                className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-20 transform transition-all duration-300 ease-in-out"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
            >
                <h2 className="text-3xl font-semibold text-center mb-4 text-blue-600">Nhập mã OTP</h2>

                {/* Hướng dẫn nhập OTP */}
                <p className="text-center text-gray-600 mb-4">
                    Vui lòng nhập mã OTP đã được gửi đến số <span className="font-bold">{phone}</span>.
                </p>

                <form onSubmit={handleOtpSubmit} className="flex flex-col space-y-4">
                    <div className="flex justify-center space-x-2">
                        {otp.map((_, index) => (
                            <input
                                key={index}
                                ref={(el) => (otpInputRefs.current[index] = el)}
                                type="text"
                                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-200 transform hover:scale-105"
                                maxLength={1}
                                value={otp[index]}
                                onChange={(e) => handleOtpChange(e.target, index)}
                                onFocus={(e) => e.target.select()}
                            />
                        ))}
                    </div>

                    {/* Hiển thị thời gian đếm ngược */}
                    <p className="text-center text-gray-600">
                        Mã OTP sẽ hết hạn sau: <span className="font-bold text-red-600">{timeLeft}s</span>
                    </p>

                    <button
                        type="submit"
                        className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition duration-300 transform hover:scale-105 shadow-lg"
                    >
                        Xác nhận OTP
                    </button>
                </form>

                {/* Nút gửi lại OTP */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600">Không nhận được mã?</p>
                    <button
                        onClick={handleResendOtp}
                        className="text-blue-600 hover:underline hover:text-blue-800 transition duration-300 mt-2"
                    >
                        Gửi lại mã OTP
                    </button>
                </div>
            </Modal>
        </div>
    );
}

export default RegisterForm;
